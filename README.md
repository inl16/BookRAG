# BookRAG

A Book Retrieval-Augmented Generation (RAG) system enables you to interact with any book by asking questions and receiving answers directly from the text. It provides precise page numbers where the information is found, allowing for a deeper understanding and easy reference within the book.


Here are the steps I took to make it after taking pictures of each page in my textbook


Step 1 

this code reads all PNG files from an input directory, sorts them in numerical order based on any numbers in their filenames. For each selected image, it uses the sharp library to crop the center portion corresponding to a 28.2% zoom factor and then resizes the cropped area back to the original dimensions, effectively zooming into the center of the image. The zoomed images are saved sequentially in an output folder named zoomed-pngs with filenames like page_1.png, page_2.png, and so on, ensuring the output directory exists before saving.

Step 2 

This code scans all PNG files in the `./zoomed-pngs` directory and uses Tesseract.js to extract text from each image through optical character recognition (OCR). For each processed image, it generates a corresponding JSON file containing the page number and the extracted text, saving these JSON files in the `./DigitalAssetJsons` directory with names like `page_1.json`, `page_2.json`, and so on. Additionally, the script ensures that the output directory exists, logs the progress of each file processed, and handles any errors that may occur during the extraction and file-writing process.

Step 3 


This JavaScript code forms the core of the BookRAG (Retrieval-Augmented Generation) system, enabling seamless interaction with textbook content. Building upon the initial steps of image processing and text extraction, it organizes the extracted JSON data into categorized collections within the Weaviate vector database. Each category, defined in the `mapping` object with detailed summaries and topics, is created as a separate collection to facilitate efficient and relevant data retrieval.

The system leverages Anthropic's AI to intelligently categorize user queries, determining the most pertinent sections of the textbook based on the predefined categories. When a user inputs a query, the `runQuery` function identifies relevant categories, searches the corresponding Weaviate collections for the top matching documents, and compiles these results. It then sends this contextual information to Anthropic's AI, which generates a comprehensive answer that cites the specific file names (representing textbook pages) where the information is located. This ensures that users receive precise answers along with exact page references, enhancing their ability to understand and navigate the textbook content effectively.

Additionally, the code includes robust mechanisms for managing data ingestion and query handling. The `processJSONs` function reads and imports the categorized JSON files into Weaviate, while the `importData` function ensures that the data is correctly inserted into each collection. By integrating OpenAI and Anthropic's AI services, the system not only retrieves relevant information but also generates well-sourced responses, making the BookRAG system a powerful tool for interacting with and extracting knowledge from any textbook.


Replit Upload 


Together, these two code snippets form a cohesive system for the BookRAG (Retrieval-Augmented Generation) application. The first snippet, `queryService.js`, handles the core functionality by connecting to AI services (Anthropic and OpenAI) and the Weaviate vector database. It categorizes user queries, retrieves relevant information from categorized collections, and generates comprehensive answers citing specific sources. This modular approach ensures that queries are processed efficiently and accurately based on the structured data.

The second snippet sets up an Express.js server that serves as the interface for external interactions. It defines two endpoints: a GET `/start` for verifying server status and a POST `/query` for handling user queries. When a POST request is made to `/query` with a user's question, the server invokes the `runQuery` function from `queryService.js`, processes the query, and returns the generated answer in JSON format. This integration allows users to interact with the BookRAG system seamlessly through HTTP requests, enabling real-time access to detailed and sourced information from the textbook data.


Voiceflow

A template used to serve as a UI for this Chatbot 


