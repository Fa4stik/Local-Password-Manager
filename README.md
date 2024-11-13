# Local Password Manager

## Description

This project is a single-page application (SPA) built with React and TypeScript for securely storing passwords locally. Users can add, edit, and delete passwords for various services. All data is encrypted and stored in `localStorage`. A master password, which the user enters at the beginning of each session, is used for encrypting and decrypting the data. The application also allows users to export encrypted passwords in JSON format and import them back.

### Demo
![Demo](https://i.imgur.com/vc45vDY.gif)
You can view a live demo of the project at https://fa4stik.github.io/Local-Password-Manager/.

## Features

- **Master Password Setup and Data Encryption:**
    - Users set a master password on their first login, which is used for encrypting and decrypting all records.
    - The master password is not stored in `localStorage` and is only used in the current session to work with the data.
    - After entering the master password, the application decrypts the passwords stored in `localStorage`.

- **Password Storage and Management:**
    - Users can add, edit, and delete password records. Each record contains:
        - Service name (e.g., "Gmail")
        - Username or email
        - Password
    - All records are encrypted using the master password before being saved in `localStorage`.

- **Data Export and Import:**
    - **Export:** Users can export all passwords in JSON format in an encrypted form. The exported file contains encrypted data that can be loaded later.
    - **Import:** Users can load a JSON file with encrypted passwords back into the application. After successfully entering the master password, the data is decrypted and added to `localStorage`.

- **Data Encryption and Decryption:**
    - Encryption and decryption are performed on the client side using the master password. It is recommended to use the AES algorithm for symmetric encryption (e.g., using the `crypto-js` library).
    - If the master password is incorrect, the data cannot be decrypted, and the application should display an error message.

- **Interface and Styling:**
    - The interface is implemented using React, TypeScript, and Tailwind CSS.
    - A simple and user-friendly interface for adding, editing, and deleting password records.
    - A button to show or hide the password on the card so that the user can temporarily see the password.

- **Session Management:**
    - If the user closes the tab, the master password is removed from the browser's memory, and a new master password is required to decrypt the data upon re-entry.

## Technical Requirements

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS
- **Storage:** `localStorage` for storing encrypted data
- **Encryption:** Use the `crypto-js` library or similar to implement AES-256 encryption

## Example Interface

- **Login Page:** Field for entering the master password. On the first login, the option to create a master password.
- **Main Page:** List of saved passwords with the ability to add, edit, and delete.
- **Add Password:** Form with fields "Service Name", "Username", and "Password".

## Security Notes

- The master password is only used on the client side and is not stored in `localStorage` or other places on the device.
- When exiting the application or closing the tab, the master password is cleared from memory.

## Installation and Usage

### Run
To run the project locally, you need to have Docker and Docker Compose installed, follow these steps:

**1. Docker installation:** https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository

**2. Clone the repository:**
```shell
git clone https://github.com/Fa4stik/Local-Password-Manager.git && cd Local-Password-Manager
```

**3. Run the project:**
```shell
docker compose up
```
This command will build and start the application. You can access it in your browser at http://localhost or http://127.0.0.1.


### Build
To build the project using the production Dockerfile, follow these steps:

**1. Clone the repository:**
```shell
git clone https://github.com/Fa4stik/Local-Password-Manager.git && cd Local-Password-Manager
```

**2. Build the Docker image:**
```shell
docker build -t fa4stik/localpasswordmanager:latest .
```

**3. Run the Docker container:**
```shell
docker run -p 80:80 fa4stik/localpasswordmanager:latest
```

This command will start the application in production mode. You can access it in your browser at http://localhost or http://127.0.0.1.

### Run without Docker
To run the project without Docker, follow these steps:

**1. Install Node.js:**
Go to the official [Node.js](https://nodejs.org/en) website and download the installer for your operating system: Node.js.

**2: Install corepack**
Corepack comes bundled with Node.js starting from version 16.10.0. To ensure corepack is installed, run the following command:
```shell
corepack --version
```

**3: Enable pnpm support via corepack**
Activate pnpm support using corepack:
```shell
corepack enable
corepack prepare pnpm@latest --activate
```

**4. Clone the repository:**
```shell
git clone https://github.com/Fa4stik/Local-Password-Manager.git && cd Local-Password-Manager
```

**5: Install dependencies and run the project**
```shell
pnpm install && pnpm dev
```
The project should now be accessible in your browser at http://localhost:3000 or http://127.0.0.1:3000.