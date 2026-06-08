# [Project Name]

Street Smart: A QR-based payment for Street Vendors

## Problem
[What problem does this solve? Who has this problem? Why does it matter — Philippines relevance if applicable?]
The problem that it solved is this problem: Street vendors can't accept digital payments — apps require smartphones and bank accounts. Philippines 
has many street vendors that go out everyday, and seeing that everything in these days is digital--especially payment--with StreetSmart, it would be able
to help the vendors adapt to the modern age without needing any back accounts.

## How It Works
 Street Smart bridges the digital gap for vendors who don't have access to expensive POS systems or complex banking apps.
   1. Vendor Setup: A vendor connects their Freighter wallet and switches to "Vendor Mode". They are immediately presented
      with a unique QR code for their stall.
   2. Customer Action: A customer scans the vendor's QR code using their phone camera or by uploading a saved image.
   3. Payment: The customer enters the amount (e.g., for a quick street snack) and signs the transaction via Freighter.
   4. Instant Confirmation: Within 5 seconds, the Vendor's dashboard flashes a "New Sale" notification, showing the exact
      amount received, allowing them to hand over the goods immediately without checking a bank statement.

## How It Uses Stellar
- Fast Payments: Uses Stellar’s core payment operations to settle funds in ~5 seconds, matching the speed of a cash
     transaction.
   - Horizon Streaming: Uses the streamPayments feature of the Horizon API to provide the vendor with a real-time "Live
     Sales Feed"—the digital equivalent of hearing coins drop in a jar.
   - Classic Assets: Supports XLM and USDC (with trustline checks), enabling vendors to accept stablecoins to avoid
     volatility.
   - Low Fees: Leverages Stellar’s near-zero transaction fees, making it economically viable for micro-payments as small as
     1 PHP.

## Track
  Financial Inclusion / Payments (StellarX Philippines Workshop @ PUP QC)

## Tech Stack
   - Framework: Next.js 16 (React 19)
   - Stellar SDK: @stellar/stellar-sdk v15.1.0
   - Wallet: @stellar/freighter-api v6.0.1
   - QR Utilities: qrcode.react (Generation) and html5-qrcode (Scanning)
   - Styling: Tailwind CSS 4.0
   - Network: Stellar Testnet


## Setup & Run
  To run Street Smart locally:

   1 # Navigate to the project folder
   2 cd "Street Smart/web"
   3
   4 # Install dependencies
   5 npm install
   6
   7 # Start the development server
   8 npm run dev
  The application will be available at http://localhost:3000.


## Network Details
   - Network: Testnet
   - Horizon URL: https://horizon-testnet.stellar.org
   - RPC URL: https://soroban-testnet.stellar.org
   - USDC Issuer: GBBD67VTB7NCBXPG4SST4YMWBNJQBR7YCCXN8OYNCBU6S52KTR6N6TFY (Testnet)

## Solo
- [James Carl E. Soriano] — @[jcsorianoplp]
- ...

## License
MIT