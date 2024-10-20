

def annonce_deny(uuid):
    return f"""
Hello, 
We are sorry to inform you that the person renting the bike has refused your offer for the {uuid} bike. 
However, don't let this put you off. Another renter will surely accept. 
Keep surfing !
"""

def annonce_accept(uuid):
    return f"""
Good news! 

Your offer for {uuid} has been accepted! 
We will now proceed with the communication with the renter. 

Choose an action!
"""

def offer_to_renter(uuid):
    return f"""
Hey, 
A customer wishes to hire your bike under this ad {uuid}. Do you accept?
"""

def renter_accept():
    return """
We're going to start communicating with the customer. 
"""

def set_rental_period():
    return """
Reply with the date with this format :
DD/MM/YYYY to DD/MM/YYYY
"""

def cancel_offer(uuid):
    return f"""
We have some bad news ;(

The renter of {uuid} has decided not to hire out his bike to you any more.

However, don't let this put you off. Another renter will surely accept. 
Keep surfing !
"""
