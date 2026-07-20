<?php

namespace App\Services;

use App\Mail\WelcomeUserMail;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UserService
{
    private string $lastEmailError = '';

    public function generateTemporaryPassword(int $length = 14): string
    {
        if ($length < 12) {
            $length = 12;
        }

        $lowercase = 'abcdefghijkmnpqrstuvwxyz';
        $uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        $digits = '23456789';
        $special = '!@#$%&*?-_';

        $password = '';
        $password .= $uppercase[random_int(0, strlen($uppercase) - 1)];
        $password .= $lowercase[random_int(0, strlen($lowercase) - 1)];
        $password .= $digits[random_int(0, strlen($digits) - 1)];
        $password .= $special[random_int(0, strlen($special) - 1)];

        $all = $lowercase . $uppercase . $digits . $special;
        for ($i = strlen($password); $i < $length; $i++) {
            $password .= $all[random_int(0, strlen($all) - 1)];
        }

        $chars = str_split($password);
        shuffle($chars);

        return implode('', $chars);
    }

    public function createUser(array $data): array
    {
        Log::info('[UserService] Début création utilisateur', ['email' => $data['email']]);

        $plainPassword = $this->generateTemporaryPassword();
        Log::info('[UserService] Mot de passe temporaire généré');

        $user = DB::transaction(function () use ($data, $plainPassword) {
            return User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($plainPassword),
                'role_id' => $data['role_id'],
                'agency_id' => $data['agency_id'],
                'status' => $data['status'],
                'must_change_password' => true,
                'email_verified_at' => now(),
            ]);
        });

        Log::info('[UserService] Utilisateur créé en base', ['user_id' => $user->id, 'email' => $user->email]);

        $emailSent = $this->sendWelcomeEmail($user, $plainPassword);

        return [
            'user' => $user,
            'plain_password' => $plainPassword,
            'email_sent' => $emailSent,
            'email_error' => $this->lastEmailError,
        ];
    }

    private function sendWelcomeEmail(User $user, string $plainPassword): bool
    {
        Log::info('[UserService] Début envoi email de bienvenue', ['email' => $user->email]);

        try {
            $user->load(['role', 'agency']);

            $parts = explode(' ', $user->name, 2);
            $firstName = $parts[0] ?? '';
            $lastName = $parts[1] ?? '';

            Log::info('[UserService] Instanciation du Mailable', [
                'firstName' => $firstName,
                'lastName' => $lastName,
                'role' => $user->role->name ?? '—',
                'agency' => $user->agency->city ?? '—',
            ]);

            Mail::to($user->email)->send(
                new WelcomeUserMail(
                    firstName: $firstName,
                    lastName: $lastName,
                    email: $user->email,
                    plainPassword: $plainPassword,
                    roleName: $user->role->name ?? '—',
                    agencyName: $user->agency->city ?? '—',
                )
            );

            Log::info('[UserService] Email envoyé avec succès', ['email' => $user->email]);
            return true;
        } catch (\Exception $e) {
            $this->lastEmailError = $e->getMessage();
            Log::error("[UserService] Erreur envoi email pour {$user->email}: " . $e->getMessage(), [
                'exception' => $e,
            ]);
            return false;
        }
    }
}
