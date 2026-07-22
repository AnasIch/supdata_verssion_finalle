<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation du mot de passe — SUPDATA ERP</title>
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
                            Réinitialisation du mot de passe
                        </p>
                    </td>
                </tr>

                {{-- Body --}}
                <tr>
                    <td style="padding: 36px 40px 20px;">
                        <p style="margin: 0 0 20px; color: #334155; font-size: 15px; line-height: 1.6;">
                            Bonjour,
                        </p>
                        <p style="margin: 0 0 28px; color: #475569; font-size: 14px; line-height: 1.7;">
                            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
                        </p>

                        {{-- Reset Button --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                            <tr>
                                <td align="center">
                                    <a href="{{ $resetUrl }}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 10px;">
                                        Réinitialiser le mot de passe
                                    </a>
                                </td>
                            </tr>
                        </table>

                        {{-- Fallback link --}}
                        <p style="margin: 0 0 28px; color: #64748b; font-size: 13px; line-height: 1.6;">
                            Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
                        </p>
                        <p style="margin: 0 0 28px; word-break: break-all; color: #3b82f6; font-size: 12px; line-height: 1.5;">
                            {{ $resetUrl }}
                        </p>

                        {{-- Security Notice --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 10px; margin-bottom: 8px;">
                            <tr>
                                <td style="padding: 16px 20px;">
                                    <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                                        <strong>Important :</strong> Ce lien expirera dans <strong>60 minutes</strong>. Si vous n'avez pas demandé la réinitialisation de votre mot de passe, vous pouvez ignorer cet email en toute sécurité.
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
