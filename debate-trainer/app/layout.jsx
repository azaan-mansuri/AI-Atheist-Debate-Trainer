export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&family=Noto+Nastaliq+Urdu:wght@400..700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AI Debate Trainer | Voice Debate Assistant</title>
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: "'Inter', 'Noto Nastaliq Urdu', system-ui, sans-serif",
        background: '#0f0f1a',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  );
}