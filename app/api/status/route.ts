import { google } from 'googleapis';

export async function GET() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets'
            ],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Status!A2:C',
        });

        const rows = response.data.values || [];

        const technicians = rows
            .filter((row: any[]) => row[0])
            .map((row: any[]) => ({
                name: row[0] || '',
                status: (row[1] || '').trim().toLowerCase(),
                location: row[2] || '',
            }));

        return Response.json(technicians, { status: 200 });
    }
    catch (e: any) {
        console.error('Error fetching status:', e.message);
        return Response.json({ 
            error: 'Failed to fetch technician status'
        }, { status: 500 });
    }
}
