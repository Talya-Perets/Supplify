package com.frontend;

import androidx.test.espresso.IdlingRegistry;
import androidx.test.espresso.IdlingResource;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.rule.ActivityTestRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.*;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.*;
import static androidx.test.espresso.matcher.RootMatchers.withDecorView;
import static org.hamcrest.Matchers.not;

@RunWith(AndroidJUnit4.class)
public class LoginScreenTest {
    @Rule
    public ActivityTestRule<MainActivity> activityRule = new ActivityTestRule<>(MainActivity.class);

    @Test
    public void testLoginFormInteractions() {
        // Test email input
        onView(withId(R.id.email_input))
            .perform(typeText("test@example.com"), closeSoftKeyboard())
            .check(matches(withText("test@example.com")));

        // Verify email field is visible and enabled
        onView(withId(R.id.email_input))
            .check(matches(isDisplayed()))
            .check(matches(isEnabled()));

        // Test password input
        onView(withId(R.id.password_input))
            .perform(typeText("password123"), closeSoftKeyboard())
            .check(matches(withText("password123")));

        // Verify password field is secure
        onView(withId(R.id.password_input))
            .check(matches(hasTextInputLayout(R.id.password_layout)))
            .check(matches(isPasswordHidden()));

        // Test login button
        onView(withId(R.id.login_button))
            .check(matches(isDisplayed()))
            .check(matches(isEnabled()))
            .perform(click());

        // Wait for login response and verify
        onView(withId(R.id.loading_indicator))
            .check(matches(not(isDisplayed())));
    }

    @Test
    public void testEmptyFormValidation() {
        // Click login without data
        onView(withId(R.id.login_button))
            .perform(click());

        // Verify error messages
        onView(withId(R.id.email_input))
            .check(matches(hasErrorText("שדה חובה")));

        onView(withId(R.id.password_input))
            .check(matches(hasErrorText("שדה חובה")));
    }
}