package com.Supplify.Supplify.services;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class WhatsAppService {

    // Twilio credentials
    public static final String ACCOUNT_SID = "";
    public static final String AUTH_TOKEN = "";
    public static final String TWILIO_PHONE_NUMBER = ""; // Your Twilio WhatsApp number

    static {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    public void sendWhatsAppMessage(String phoneNumber, String message) {
        String recipientPhone = "";

        try {
            // Send message via Twilio WhatsApp API
            Message.creator(
                    new com.twilio.type.PhoneNumber("whatsapp:" + recipientPhone), // recipient phone number
                    new com.twilio.type.PhoneNumber(TWILIO_PHONE_NUMBER), // Twilio WhatsApp phone number
                    message
            ).create();
            System.out.println("WhatsApp message sent to: " + phoneNumber);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error sending WhatsApp message.");
        }
    }
}
