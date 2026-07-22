<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande rejetée — SUPDATA ERP</title>
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
                            Demande rejetée
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
                            La demande <strong>{{ $demande->title }}</strong> a été rejetée par l'Administrateur Local <strong>{{ $actor->name }}</strong>.
                        </p>

                        {{-- Status Badge --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                            <tr>
                                <td align="center">
                                    <span style="display: inline-block; background-color: #fee2e2; color: #b91c1c; font-size: 13px; font-weight: 700; padding: 8px 24px; border-radius: 20px; letter-spacing: 0.3px;">
                                        REJETÉE
                                    </span>
                                </td>
                            </tr>
                        </table>

                        {{-- Demand Card --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 24px 28px;">
                                    <p style="margin: 0 0 16px; color: #0f172a; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">
                                        DÉTAILS DE LA DEMANDE
                                    </p>

                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 140px; vertical-align: top;">Titre</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $demande->title }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Produit</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $demande->product_name ?? '—' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Rejeté par</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $actor->name }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Date</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ now()->locale('fr')->isoFormat('DD MMM YYYY — HH:mm') }}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        {{-- Rejection Reason --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin-bottom: 28px;">
                            <tr>
                                <td style="padding: 20px 24px;">
                                    <p style="margin: 0 0 8px; color: #991b1b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Motif du rejet
                                    </p>
                                    <p style="margin: 0; color: #b91c1c; font-size: 14px; line-height: 1.6;">
                                        {{ $reason }}
                                    </p>
                                </td>
                            </tr>
                        </table>

                        {{-- CTA Button --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                            <tr>
                                <td align="center">
                                    <a href="{{ url('/demandes/' . $demande->id) }}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 10px;">
                                        Consulter la demande
                                    </a>
                                </td>
                            </tr>
                        </table>

                        {{-- Info Notice --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; margin-bottom: 8px;">
                            <tr>
                                <td style="padding: 16px 20px;">
                                    <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.6;">
                                        <strong>Information :</strong> Cette demande a été rejetée par l'Administrateur Local. Le motif du rejet est mentionné ci-dessus.
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
