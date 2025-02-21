package com.frontend;

import android.util.Log;
import androidx.test.espresso.util.HumanReadables;
import androidx.test.espresso.util.TreeIterables;
import android.view.View;



import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.rule.ActivityTestRule;
import androidx.test.espresso.Espresso;
import androidx.test.espresso.assertion.ViewAssertions;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.espresso.action.ViewActions;

import org.junit.Rule;
import org.junit.Test;
import org.junit.Before;
import org.junit.runner.RunWith;

import static androidx.test.espresso.matcher.ViewMatchers.*;
import static androidx.test.espresso.matcher.ViewMatchers.withTagValue;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.allOf;
import static androidx.test.espresso.assertion.ViewAssertions.*;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;;

@RunWith(AndroidJUnit4.class)
public class ExampleTest {

    @Rule
    public ActivityTestRule<MainActivity> activityRule =
        new ActivityTestRule<>(MainActivity.class);

    @Test
    public void checkLoginFlow() {

        try {
            Thread.sleep(7000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    

        //Enter the Email
       // Locate the TextInput using its placeholder
        onView(ViewMatchers.withHint("Email"))
        // Clear any existing text
        .perform(ViewActions.clearText())
        // Type new text
        .perform(ViewActions.typeText("LoginTestUser@gmail.com")); 

        //Enter the Password
        // Locate the TextInput using its placeholder
        onView(ViewMatchers.withHint("Password"))
        // Clear any existing text
        .perform(ViewActions.clearText())
        // Type new text
        .perform(ViewActions.typeText("Login123"));

        //Click the Login button
        onView(ViewMatchers.withText("Login"))
        .perform(ViewActions.click());
          
        onView(withText("Success")).check(matches(isDisplayed()));
        
    }

    @Test
    public void checkRegisterFlow() {

        try {
            Thread.sleep(7000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        onView(withText("Sign up")).perform(ViewActions.click());

         onView(ViewMatchers.withHint("Last Name"))
        .perform(ViewActions.clearText())
        .perform(ViewActions.typeText("Register")); 

         onView(ViewMatchers.withHint("First Name"))
        .perform(ViewActions.clearText())
        .perform(ViewActions.typeText("Test")); 

         onView(ViewMatchers.withHint("Email"))
        .perform(ViewActions.clearText())
        .perform(ViewActions.typeText("RegisterTestUser@gmail.com")); 

         onView(ViewMatchers.withHint("Business Name"))
        .perform(ViewActions.clearText())
        .perform(ViewActions.typeText("Registerations")); 

         onView(ViewMatchers.withHint("Phone Number"))
        .perform(ViewActions.clearText())
        .perform(ViewActions.typeText("0507133771")); 

         onView(ViewMatchers.withHint("Address"))
        .perform(ViewActions.clearText())
        .perform(ViewActions.typeText("Registration street")); 

         onView(ViewMatchers.withHint("Password"))
        .perform(ViewActions.clearText())
        .perform(ViewActions.typeText("Register123")); 
    
        onView(ViewMatchers.withHint("Confirm Password"))
        .perform(ViewActions.clearText())
        .perform(ViewActions.typeText("Register123")); 

        //Click the Login button
        onView(ViewMatchers.withText("Sign up"))
        .perform(ViewActions.click());
          
        onView(withText("Success")).check(matches(isDisplayed()));
        
    }

}
