import Anthropic from "@anthropic-ai/sdk";
import weaviate, { vectorizer, generative, dataType } from "weaviate-client";
import OpenAI from "openai";
import readline from "readline";
import dotenv from "dotenv";
dotenv.config();

const mapping = {
    "Federal Regulation of Virtual Currency Business": {
        summary:
            "The document details the complex regulatory landscape surrounding virtual currency businesses in the United States, which are governed by a combination of federal and state laws. It highlights the challenge of applying traditional financial regulations to new technologies such as cryptocurrencies and blockchain. Federal agencies like the SEC, CFTC, and FinCEN play key roles in overseeing virtual currency businesses, focusing on consumer protection, market integrity, and preventing illicit activities. The document also discusses the variability in regulatory approaches across states and the evolving nature of cryptocurrency-related business models.",
        topics: [
            "Complexity of U.S. virtual currency regulations",
            "Dual federal and state regulatory systems",
            "Preexisting regulations applied to new technologies",
            "Role of the SEC, CFTC, and FinCEN in regulation",
            "Distinctions between virtual currencies and cryptoassets",
            "Categories of virtual currency businesses (wallets, exchanges, brokers, miners)",
            "Different types of virtual currencies (e.g., Bitcoin, Ethereum)",
            "The impact of Initial Coin Offerings (ICOs)",
            "The SEC’s view on when digital assets qualify as securities",
            "FinCEN's role in combatting money laundering through virtual currencies",
            "Money Services Business (MSB) classifications for virtual currency companies",
            "Guidance on centralized and decentralized virtual currencies",
            "FinCEN's 2013 and 2019 regulatory guidance on virtual currencies",
            "Compliance obligations for virtual currency businesses under the Bank Secrecy Act (BSA)",
            "Anti-money laundering (AML) program requirements",
            "Differences between hosted and unhosted virtual wallets",
            "Regulations around peer-to-peer (P2P) exchanges and decentralized applications (DApps)",
            "Regulatory treatment of CVC kiosks (cryptocurrency ATMs)",
            "Fines and penalties for non-compliance, such as in the BTC-e case",
            "Anonymity-enhanced cryptocurrencies and their legal implications",
        ],
    },
    "Fundraising and Securities": {
        summary:
            "The document discusses the legal implications of fundraising mechanisms, such as Initial Coin Offerings (ICOs) and token sales, under U.S. securities laws. It examines whether tokens sold in these offerings can be classified as securities, focusing on the SEC's application of the Howey Test. The document explores key legal cases, like the DAO case, and highlights the SEC's evolving regulatory stance on digital assets. It concludes with a review of enforcement actions and guidance issued by the SEC regarding ICOs.",
        topics: [
            "Initial Coin Offerings (ICOs)",
            "Token sales and security token offerings",
            "ERC-20 protocol and Ethereum-based tokens",
            "White papers and tokenomics",
            "US Securities Law and digital assets",
            "Securities Act of 1933",
            "Securities Exchange Act of 1934",
            "Howey Test and investment contracts",
            "Shavers case and virtual currencies",
            "The DAO and SEC's investigation",
            "SEC's Rule 21(a) Report",
            "Application of securities laws to blockchain",
            "Enforcement actions by the SEC",
            "Security versus utility tokens",
            "Munchee case and unregistered token offerings",
            "Investor expectations and profits",
            "Smart contracts and decentralized organizations",
            "Legal definitions of securities",
            "Impact of DAO hard fork",
            "Regulatory guidance for virtual currency issuers",
        ],
    },
    "Overview of Distributed Ledger Technology": {
        summary:
            "This document provides an in-depth overview of distributed ledger technology (DLT) and its applications, particularly focusing on Bitcoin and blockchain. It discusses the origins of Bitcoin, the technical concepts behind blockchain, consensus mechanisms, wallets, and keys. Additionally, it addresses various use cases of blockchain, smart contracts, and the regulatory landscape surrounding digital assets and cryptocurrencies. It also covers topics like public versus private blockchains, consensus protocols such as proof of work and proof of stake, and the risks and benefits of these technologies.",

        topics: [
            "Satoshi Nakamoto and Bitcoin's white paper",
            "Proof-of-work and proof-of-stake consensus mechanisms",
            "Blockchain technology and distributed ledgers",
            "Double-spending problem and its solution",
            "Cryptography and digital signatures in Bitcoin",
            "Bitcoin mining and miners",
            "Wallets and private/public keys",
            "Smart contracts and their legal implications",
            "Public vs. private blockchains",
            "Digital assets, tokens, and cryptocurrencies",
            "Regulation of virtual currency businesses",
            "Security tokens and tokenized securities",
            "Applications of blockchain in industries",
            "Challenges of consensus mechanisms",
            "Privacy in blockchain transactions",
            "History and growth of Bitcoin and digital currencies",
            "Environmental impact of blockchain technologies",
            "Governance and decentralization in blockchain systems",
            "Risks and rewards of digital assets",
            "Evolution of laws related to cryptocurrencies",
        ],
    },
    "Smart Contracts": {
        summary:
            "The document explains the concept, history, and functionality of smart contracts, which are self-executing agreements coded into blockchain systems. It covers their evolution, starting from Nick Szabo’s initial ideas, and their implementation on platforms like Ethereum. The document also addresses the benefits, challenges, and legal issues surrounding smart contracts, including enforcement difficulties, scalability limitations, and the role of oracles. Additionally, it explores the different types of smart contracts, their legal enforceability, and the interplay between code and natural language agreements.",
        topics: [
            "Definition and concept of smart contracts",
            "History and evolution of smart contracts",
            "Nick Szabo's contributions",
            "Blockchain and smart contracts",
            "Ethereum and smart contract deployment",
            "How smart contracts work",
            "Types of smart contracts",
            "Challenges of smart contract enforcement",
            "Legal status of smart contracts",
            "Oracles and external data sources",
            "Smart legal contracts",
            "Automation and programmatic execution",
            "Scalability and performance limitations",
            "Standardization and security benefits",
            "Role of electronic signatures",
            "Smart contract coding and documentation",
            "The B2C2 vs. Quoine case",
            "Unilateral mistakes in contract law",
            "Role of oracles in smart contracts",
            "Potential risks in smart contract execution",
        ],
    },
    "State Regulation of Virtual Currency Business": {
        summary:
            "The document provides a detailed analysis of state regulations governing virtual currency businesses, focusing on licensing requirements, anti-money laundering protocols, and consumer protection measures. It discusses compliance with financial and legal obligations for virtual currency businesses, including quarterly reporting, customer disclosures, and anti-fraud programs. Various case studies, including New York's BitLicense and legal rulings from Florida and Texas, illustrate the evolving legal landscape surrounding virtual currencies. The document also covers key compliance areas such as advertising, record-keeping, and customer identification protocols.",
        topics: [
            "Licensing requirements for virtual currency businesses",
            "Anti-money laundering (AML) program",
            "Financial disclosures and reporting",
            "Customer identification and verification",
            "Record-keeping protocols",
            "Consumer protection measures",
            "Suspicious Activity Reporting (SAR)",
            "Examinations by regulatory authorities",
            "Permissible investments and off-balance sheet items",
            "Disclosure of material risks to customers",
            "Regulation of advertising and marketing",
            "Cybersecurity and fraud prevention",
            "Handling complaints and dispute resolution",
            "Quarterly and annual financial statements",
            "Risk assessments for legal and compliance risks",
            "Use of blockchain technology in transactions",
            "Prohibition of accounts with foreign shell entities",
            "Regulatory guidance from New York, Florida, and Texas",
            "Money transmission laws and virtual currency",
            "Impact of stablecoins on virtual currency regulations",
        ],
    },
    "Taxation of Digital Assets": {
        summary:
            "The document discusses the taxation of digital assets, focusing on virtual currencies such as Bitcoin. It explains the U.S. Internal Revenue Service's (IRS) stance, notably that virtual currencies are treated as property, not currency, for tax purposes. This classification leads to various tax implications, including capital gains tax, self-employment tax, and tax reporting obligations. The document also covers IRS guidance, enforcement actions, and unresolved issues, such as the taxation of token offerings and hard forks in cryptocurrencies.",
        topics: [
            "IRS Notice 2014-21 on virtual currency taxation",
            "Virtual currencies classified as property",
            "Capital gains and losses on virtual currencies",
            "Self-employment tax on cryptocurrency mining",
            "IRS tax enforcement on digital asset transactions",
            "Tax implications of using virtual currency for goods and services",
            "Form 1099-K reporting requirements for virtual currency payments",
            "Revenue Ruling 2019-24 on hard forks",
            "Airdrop taxation and fair market value determination",
            "Tax treatment of cryptocurrency received for services",
            "Token offerings and their tax implications",
            "IRS educational letters and enforcement efforts on digital assets",
            "Like-kind exchanges and cryptocurrency under the Tax Cuts and Jobs Act of 2017",
            "Taxation of virtual currency wages for employees and independent contractors",
            "Backup withholding requirements for virtual currency payments",
            "Reporting requirements for third-party settlement organizations in virtual currency transactions",
            "Tax consequences of exchanging one cryptocurrency for another",
            "Cryptocurrency tax reporting under the Virtual Currency Tax Fairness Act",
            "Penalties for failure to report virtual currency transactions",
            "IRS summonses and litigation involving cryptocurrency exchanges (Coinbase case)",
        ],
    },
    "The Offer and Sales of Tokens Under US Securities Laws": {
        summary:
            "The document discusses the regulatory framework for offering and selling tokens under U.S. securities laws. It examines when tokens are classified as securities, the registration requirements under the Securities Act, and available exemptions. The document also covers the responsibilities of issuers, the anti-fraud provisions, and the need for compliance with both federal and state regulations. Furthermore, it highlights key legal cases, including SEC enforcement actions, and addresses the implications for crowdfunding, broker-dealer registration, and foreign securities laws.",

        topics: [
            "Tokens as securities under U.S. law",
            "Securities Act registration requirements",
            "Exemptions from Securities Act registration",
            "SEC Regulation A and D",
            "Crowdfunding regulations for token offerings",
            "Anti-fraud provisions in securities laws",
            "Exchange Act reporting requirements",
            "Broker-dealer registration requirements",
            "Regulation S for international token offerings",
            "SEC enforcement actions related to token sales",
            "Investment Company Act compliance",
            "Money services business (MSB) registration with FinCEN",
            "Securities anti-touting provisions",
            "State securities registration requirements",
            "Tax implications of token sales",
            "Sarbanes-Oxley Act compliance",
            "Celebrity endorsements of ICOs",
            "Form D filings under Regulation D",
            "Transfer restrictions and resale limitations",
            "Public and private token offerings",
        ],
    },
    "Virtual Currency and Criminal Law": {
        summary:
            "The document discusses the relationship between virtual currencies and criminal law, focusing on how virtual currencies, like Bitcoin, have been used in criminal activities, especially on platforms such as Silk Road. It explores legal challenges posed by virtual currencies in criminal cases, including money laundering, narcotics trafficking, and computer hacking. The file also highlights notable legal cases, such as the prosecution of Ross Ulbricht for running the Silk Road, and addresses the broader implications for virtual currencies in law enforcement and regulatory frameworks. Additionally, it examines the use of cryptocurrencies in dark web marketplaces and related criminal conspiracies.",
        topics: [
            "Silk Road and Bitcoin",
            "Narcotics trafficking and virtual currencies",
            "Money laundering through cryptocurrencies",
            "Ross Ulbricht's legal case",
            "Dark web marketplaces",
            "Conspiracies involving cryptocurrency",
            "Legal challenges of prosecuting virtual currency crimes",
            "Anonymous online transactions",
            "Use of cryptocurrencies for hacking tools and malicious software",
            "Liberty Reserve money laundering scheme",
            "U.S. laws and regulations regarding digital currencies",
            "Prosecution of illegal online marketplaces",
            "Financial conspiracies facilitated by virtual currencies",
            "Impact of virtual currencies on criminal law enforcement",
            "Buyer-seller exception in narcotics transactions",
            "Role of intermediaries in virtual currency crimes",
            "Bitcoin as a form of payment in illegal transactions",
            "Automated systems and conspiracy laws",
            "Legal definitions of 'financial transaction' with cryptocurrencies",
            "U.S. Department of Justice's actions against dark web markets",
        ],
    },
};

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const WEAVIATE_URL = process.env.WEAVIATE_URL;
const WEAVIATE_API_KEY = process.env.WEAVIATE_API_KEY;
const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;

const openai = new OpenAI({
    apiKey: OPEN_AI_API_KEY,
});

const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
});

const weaviateClient = await weaviate.connectToWeaviateCloud(WEAVIATE_URL, {
    authCredentials: new weaviate.ApiKey(WEAVIATE_API_KEY),
    headers: {
        "X-OpenAI-Api-Key": OPEN_AI_API_KEY,
    },
});

async function getRelevantCategories(query) {
    const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        system: "You are an expert at categorizing queries. Given a user query, determine relevant categories to search for information.",
        tool_choice: {
            type: "tool",

            name: "print_categories",
        },
        temperature: 0,
        tools: [
            {
                name: "print_categories",
                description:
                    "Prints an array of relevant category names for the given query. Available categories:\n" +
                    JSON.stringify(mapping, null, 2),
                input_schema: {
                    type: "object",
                    properties: {
                        categories: {
                            type: "array",
                            items: { type: "string" },
                        },
                    },
                    required: ["categories"],
                },
            },
        ],
        max_tokens: 400,
        messages: [
            {
                role: "user",
                content: query,
            },
        ],
    });

    // @ts-ignore
    const categories = response.content[0].input.categories;

    return categories;
}

const searchCollection = async (query, category) => {
    // console.log("query", query);
    // console.log("category", category);
    const collectionName = category.replace(/ /g, "");

    try {
        const collection = weaviateClient.collections.get(collectionName);

        // console.log("collection", collection);

        const result = await collection.query.nearText(query, {
            limit: 3,
            returnMetadata: ["distance"],
        });

        return result.objects;
    } catch (error) {
        console.error(
            `Error searching collection ${collectionName}:`,
            error.message,
        );
        return [];
    }
};

export const runQuery = async (query) => {
    const relevantCategories = await getRelevantCategories(query);

    console.log(relevantCategories);

    const relevantVideos = await Promise.all(
        relevantCategories.map((category) =>
            searchCollection(query, category).catch((error) => {
                console.error(`Failed to search ${category}:`, error.message);
                return [];
            }),
        ),
    );

    // console.log(JSON.stringify(relevantVideos, null, 2));

    const messages = [
        {
            role: "user",
            content: `<relevant file context>
${JSON.stringify(relevantVideos)}
</relevant file context>

<user query>
${query}
</user query>

<important>
IMPORANT: You MUST cite your sources (file name)
</important>`,
        },
    ];

    // give the relevant files as context in an anthropic request
    const result = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        system: `<task>
Given relevant files as context, use the context to answer the user's query and site the sources of your answer in the format.`,
        temperature: 0,
        max_tokens: 3048,
        // @ts-ignore
        messages: messages,
    });

    // @ts-ignore
    const answer = result.content[0].text;

    console.log(answer);

    return answer;
};

// runQuery("what is a smart contract");

/// to-do: instead ask for console inpiut for the query

// // Prompt for console input for the query
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// rl.question("Please enter your query: ", (query) => {
//     runQuery(query).then(() => rl.close());
// });
