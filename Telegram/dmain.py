# Reste à : 
# - Identifier la correspondance entre les UUID et le loueur (UUID -> Loueur) ( BDD ) ->
# - Ajouter le front à la miniapp afin de pouvoir gérer la conversation dans la miniapp
# - Ajouter une option de communication manager par le bot, voir comment faire
# - Se connecter à la blockchain Ton afin de confirmer les transactions etc..
# - Manager les problèmes.
# 3ee6d905-4344-4117-a992-1d75a3d99b56

from aiogram import Bot, Dispatcher, types, executor
from aiogram.types import ReplyKeyboardMarkup , KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
import re, jwt, uuid
import sqlite3, messages
###########################################################################################"

DB_PATH = 'user.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
   
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS renters (
        user_id INT NULL,
        uuid TEXT NOT NULL,
        renter_id INT NOT NULL
    )
    ''')
    
    conn.commit()
    conn.close()


def insert_in_renters(user_id=None, uid=None, renter_id=None):
	conn = sqlite3.connect(DB_PATH)
	cursor = conn.cursor()
	sql = '''INSERT INTO renters (user_id, uuid, renter_id)
		VALUES(?,?,?) '''
	cursor = conn.cursor()
	cursor.execute(sql, (user_id, uid, renter_id))
	conn.commit()
	conn.close()

def check_uuidd(uuid):
	conn = sqlite3.connect(DB_PATH)
	cursor = conn.cursor()
	cursor.execute('''
	    SELECT renter_id FROM renters WHERE uuid = ?
	''', (uuid,))
	record = cursor.fetchone()
	conn.close()
	if record != None:	return record[0]
	return None

session_manager = {}
session_tradeoffer = {}
my_secret = 'my_super_secret'
init_db()
str_db1 = str(uuid.uuid4())
str_db2 = str(uuid.uuid4())

print(str_db1)
insert_in_renters(None, str_db1, 6324596694)
insert_in_renters(None, str_db2, 1649278833)
print(str_db1, str_db2)

###########################################################################################"



regex_uuid = r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"

key = "7374775362:AAG61pm7UGyWxT8DDcYK6memsH8cfZ6Qwn8"

wlc_msg = """
Hello,

What action do you want to take?
"""

bot = Bot(token=key)

dp = Dispatcher(bot) 

menu = InlineKeyboardMarkup()
menu.add(InlineKeyboardButton(text="Hire", callback_data="Hire_bike"))
menu.add(InlineKeyboardButton(text="Managing your rental", callback_data="Manag_rent"))
menu.add(InlineKeyboardButton(text="Report a problem", callback_data="Report"))
do_offer = InlineKeyboardMarkup(row_width=1, inline_keyboard=[[
	InlineKeyboardButton(text="Offer", callback_data="Offer"),
	InlineKeyboardButton(text="Cancel", callback_data="Cancel"),
	]])


@dp.callback_query_handler(text = "Manage_rent")
async def manag_rent(text = "Manage_rent"):
	return


@dp.callback_query_handler(text = "Hire_bike")
async def hire(call: types.CallbackQuery):
	returned_msg = """
Enter the location ID. 
Visible on the website page.
"""		
	await call.message.answer(text=returned_msg)



@dp.callback_query_handler(text = "Offer")
async def offer(call: types.CallbackQuery):

	message = call.from_user["id"]
	infos = jwt.decode(session_manager[message], key=my_secret, algorithms=['HS256'])
	message_to_renter = messages.offer_to_renter(infos["uuid"])
	
	uuid_offer = uuid.uuid4()
	payload = {
		"client_id":message,
		"renter_id":infos["renter_id"],
		"uuid":str(uuid_offer),
		"rent_time":[]
	}
	session_tradeoffer[str(uuid_offer)] = jwt.encode(payload=payload, key=my_secret)
	accept_deny = InlineKeyboardMarkup(row_width=1, inline_keyboard=[[
		InlineKeyboardButton(text="Accept", callback_data=f"{uuid_offer}-oui"),
		InlineKeyboardButton(text="Deny", callback_data=f"{uuid_offer}-non")
		]])
	await bot.send_message(text=message_to_renter, chat_id=infos["renter_id"], reply_markup=accept_deny)
	await call.message.edit_text(text="Offer sent to the renter", reply_markup=menu)

@dp.callback_query_handler(text = "send_payment")
async def send_payment(call: types.CallbackQuery):
	await call.message.reply()

@dp.callback_query_handler()
async def accept_deny(call: types.CallbackQuery):
	call_uuid = call.data[:-4]
	data = jwt.decode(session_tradeoffer[call_uuid], key=my_secret, algorithms=["HS256"]) 
	if call_uuid+"-oui" == call.data:
		message = messages.annonce_accept(call_uuid)
		await bot.send_message(text = message, chat_id=data["client_id"])
		accept_deny = InlineKeyboardMarkup(row_width=1, inline_keyboard=[[
		InlineKeyboardButton(text="Send Payment link", callback_data="send_payment"),
		InlineKeyboardButton(text="Cancel", callback_data="KEKEKEKE")
		]])
		accept_deny.add(InlineKeyboardButton(text="Communicate with client", url=f"tg://user?id={data['client_id']}"))
		await bot.send_message(chat_id= data["renter_id"], text = messages.renter_accept(), reply_markup=accept_deny)
		await call.message.delete()
		

	elif call_uuid+"-non" == call.data:
		message = messages.annonce_deny(call_uuid)
		await bot.send_message(text = message, chat_id=data["client_id"])
		await call.message.answer(text = "Message sent")
		await call.message.delete()
		
@dp.message_handler(commands=['start', 'help']) 
async def welcome(message: types.Message): 
	await message.reply(wlc_msg, reply_markup=menu) 

@dp.message_handler() 
async def check_rp(message: types.Message): 

	if message.text == "Offer":

		infos = jwt.decode(session_manager[message.from_id], key=my_secret, algorithms=['HS256'])             # Décode le JWT pour récupérer les infos dedans
		message_to_renter = messages.offer_to_renter(infos["uuid"])                                           # Récupere l'uuid dans le jwt
		await bot.send_message(chat_id=infos['renter_id'], text=message_to_renter, reply_markup=accept_deny)  # Envoi l'offre au loueur
		await message.reply("Offer sent to the renter", reply_markup=menu)                                    # Annonce que le message à été envoyé et propose le


	if re.match(regex_uuid, message.text): # Si un UUID est send par l'user
		uuid_rent = check_uuidd(message.text)

		if uuid_rent == None:
			await message.reply("No UUID matches what you have entered. Back to menu", reply_markup=menu)
		else:
			payload_data = {
				"client_id":message.from_id,
				"uuid":message.text,
				"renter_id":uuid_rent
			}
			token = jwt.encode(payload=payload_data, key=my_secret)
			session_manager[message.from_id] = token
			await message.reply("Select the action you want to take", reply_markup=do_offer)
	
executor.start_polling(dp)
