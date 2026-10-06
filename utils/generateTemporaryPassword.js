

export const generateTemporaryPassword = () => {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

    let password = "";

    for (let i = 0; i < 10; i++) {
        password += characters[
            Math.floor(Math.random() * characters.length)
        ];
    }

    return password;
};