<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur SUPDATA ERP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

                {{-- Header --}}
                <tr>
                    <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
                            SUPDATA ERP
                        </h1>
                        <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">
                            Votre compte a été créé avec succès
                        </p>
                    </td>
                </tr>

                {{-- Body --}}
                <tr>
                    <td style="padding: 36px 40px 20px;">
                        <p style="margin: 0 0 20px; color: #334155; font-size: 15px; line-height: 1.6;">
                            Bonjour <strong>{{ $firstName }} {{ $lastName }}</strong>,
                        </p>
                        <p style="margin: 0 0 28px; color: #475569; font-size: 14px; line-height: 1.7;">
                            Votre compte SUPDATA ERP a été créé avec succès. Vous pouvez maintenant accéder à la plateforme avec les informations ci-dessous.
                        </p>

                        {{-- Credentials Card --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px;">
                            <tr>
                                <td style="padding: 24px 28px;">
                                    <p style="margin: 0 0 16px; color: #0f172a; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">
                                        INFORMATIONS DE CONNEXION
                                    </p>

                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 140px; vertical-align: top;">Nom</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $lastName }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Prénom</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $firstName }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Email</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $email }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Rôle</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $roleName }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Agence</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $agencyName }}</td>
                                        </tr>
                                    </table>

                                    {{-- Password Box --}}
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                                        <tr>
                                            <td style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px;">
                                                <p style="margin: 0 0 4px; color: #92400e; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                                    Mot de passe temporaire
                                                </p>
                                                <p style="margin: 0; color: #78350f; font-size: 18px; font-weight: 700; font-family: 'Courier New', Courier, monospace; letter-spacing: 1px;">
                                                    {{ $plainPassword }}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        {{-- Login Button --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                            <tr>
                                <td align="center">
                                    <a href="{{ route('login') }}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 10px;">
                                        Accéder à la plateforme
                                    </a>
                                </td>
                            </tr>
                        </table>

                        {{-- Security Notice --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; margin-bottom: 8px;">
                            <tr>
                                <td style="padding: 16px 20px;">
                                    <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
                                        <strong>Important :</strong> Pour des raisons de sécurité, il vous sera demandé de modifier votre mot de passe lors de votre première connexion.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                {{-- Footer --}}
                <tr>
                    <td style="padding: 20px 40px 32px; text-align: center;">
                        <p style="margin: 0 0 4px; color: #94a3b8; font-size: 12px;">
                            Cordialement,
                        </p>
                        <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 600;">
                            L'équipe SUPDATA ERP
                        </p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
