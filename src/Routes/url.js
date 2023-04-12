/** BASE URL FOR BACKEND API */
const baseURL = "http://fianancetracker-env.eba-zzxqpwbf.us-east-1.elasticbeanstalk.com";


const PATHS = {
    register: "/account/register/",
    login: "/account/login/",
    details: "/account/details/",
    changePassword: "/account/change-password/",
    addTransaction: "/transaction/add/",
    transactions: "/transaction/",
    listCategories: "/transaction/list-categories/",
    sendReceipt: "/transaction/reciept/",

    googleOAUTH: "/oauth/google-auth/",
    bookstoreOAUTH: "/oauth/bookstore-auth/",
};

const clientID = "259235166395-uldsnvejl1td5q2nbvo6rfcih0a8p4k8.apps.googleusercontent.com";
const bookHubURL = "http://booksoreapi-env.eba-3igtf73b.us-east-1.elasticbeanstalk.com";
const bookHubClientID = "fpDXb3dvgwmJ3i8PJOPJxCALJGV3jqwEff3Mmxxo";
const bookHubCodeChallange = "c0aYAr2rWs4vXyaWYaFQcjbL6IBGv1cT-fj7o4qpjx0";
const redirectURI = "http://localhost:3000/oauth";


export { baseURL, PATHS, clientID, bookHubClientID, bookHubCodeChallange, bookHubURL, redirectURI };