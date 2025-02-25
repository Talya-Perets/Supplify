package com.Supplify.Supplify.services;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;

@RequiredArgsConstructor
@Service
public class FirebaseService {

    public void initializeFirebase() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                FileInputStream serviceAccount = new FileInputStream(
                        "C:/Supplify/src/main/resources/supplify-24691-firebase-adminsdk-fbsvc-70daf57774.json");
                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("🔥 Firebase initialized successfully");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void sendNotification(String token, String title, String body) {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                throw new IllegalStateException("FirebaseApp is not initialized!");
            }

            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            Message message = Message.builder()
                    .setNotification(notification)
                    .setToken(token)
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("✅ Successfully sent message: " + response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
