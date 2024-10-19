
# Importing required libraries 
from aiogram import Bot, Dispatcher, executor, types 
from aiogram.types import ReplyKeyboardMarkup 
import time, re
import sqlite3
import time, uuid

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
	return record[0]

session_manager = {}

init_db()
str_db1 = str(uuid.uuid4())
str_db2 = str(uuid.uuid4())

print(str_db1)
insert_in_renters(None, str_db1, 6324596694)
insert_in_renters(None, str_db2, 1649278833)
print(str_db1, str_db2)

###########################################################################################"

# Reste à : 
# - Identifier la correspondance entre les UUID et le loueur (UUID -> Loueur) ( BDD ) ->
# - Faire en sorte que le fil soit suivi -> Pouvoir identifier les chatid etc..
# - Ajouter le front à la miniapp afin de pouvoir gérer la conversation dans la miniapp
# - Ajouter une option de communication manager par le bot, voir comment faire
# - Se connecter à la blockchain Ton afin de confirmer les transactions etc..
# - Manager les problèmes.
# 3ee6d905-4344-4117-a992-1d75a3d99b56

regex_uuid = r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"

key = "7374775362:AAG61pm7UGyWxT8DDcYK6memsH8cfZ6Qwn8"

wlc_msg = """
Hello,

What action do you want to take?
"""

bot = Bot(token=key) 

dp = Dispatcher(bot) 

keyboard_reply = ReplyKeyboardMarkup( 
	resize_keyboard=True, one_time_keyboard=True).add("Hire a bike", "Managing your rental", "Report a problem") 

keyboard_reply_offer = ReplyKeyboardMarkup( 
	resize_keyboard=True, one_time_keyboard=True).add("Offer", "Cancel") 

renter_response = ReplyKeyboardMarkup( 
	resize_keyboard=True, one_time_keyboard=True).add("Accept", "Deny") 


@dp.message_handler(commands=['start', 'help']) 
async def welcome(message: types.Message): 
	await message.reply(wlc_msg, reply_markup=keyboard_reply) 

@dp.message_handler() 
async def check_rp(message: types.Message): 

	if message.text == "Hire a bike": 
		returned_msg = """
Enter the location ID. 
Visible on the website page.
"""		
		await message.reply(returned_msg)

	if message.text == "Accept":
		# FAIRE EN SORTE QUE SA REFUSE CHEZ LE CLIENT !
		None

	if message.text == "Offer":
		message_to_renter = """
Hey,
A customer wishes to hire your bike under this ad XXXXX. Do you accept?
"""
		await bot.send_message(chat_id=6324596694, text=message_to_renter, reply_markup=renter_response)
		await message.reply("Offer sent to the renter", reply_markup=keyboard_reply)

	if re.match(regex_uuid, message.text):
		if check_uuidd(message.text) == None:
			await message.reply("No UUID matches what you have entered. Back to menu", reply_markup=keyboard_reply)
		else:
			await message.reply("Select the action you want to take", reply_markup=keyboard_reply_offer)
	
executor.start_polling(dp) 
