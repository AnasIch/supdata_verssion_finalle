<?php

test('public registration is disabled for the internal employee application', function () {
    $this->get('/register')->assertNotFound();
    $this->post('/register', [
        'name' => 'External User', 'email' => 'external@example.com',
        'password' => 'password', 'password_confirmation' => 'password',
    ])->assertNotFound();
    $this->assertGuest();
});
