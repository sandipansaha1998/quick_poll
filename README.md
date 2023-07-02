# Quick Poll

> Real-time polling system where users can create,share, participate in polls
and view live voting results without
page refresh.Users are allowed to vote only once to maintain the consistency of the results.
> Implemented user authentication,
responsive UI, and data visualization
with dynamic progress bars.It has
anonymous voting feature as well.

## [Hosted URL link](https://quick-poll-india.netlify.app/)

The application was built on MERN stack.
### [Github repository of the backend API.](https://github.com/sandipansaha1998/polling_API)

Integrated Socket.IO for real-time 
communication..The application was hosted
on AWS EC2 with nginx and ensured secure
communication with SSL.

### Features
- [x] Signup and login users with unique emailID.
- [x] Create a poll with atleast 2 options
- [x] Share a poll with other users
- [x] View results realtime
- [x] Anonymous voting

### Dependencies
Particulars | Version
----------- | ---------
@fortawesome/fontawesome-svg-core | 6.4.0
@fortawesome/free-regular-svg-icons | 6.4.0
@fortawesome/free-solid-svg-icons | 6.4.0
@fortawesome/react-fontawesome | 0.2.0
@testing-library/jest-dom | 5.16.5
@testing-library/react | 13.4.0
@testing-library/user-event | 13.5.0
babel-plugin-macros | 3.1.0
bootstrap | 5.2.3
crypto-js | 4.1.1
js-cookie | 3.0.5
jwt-decode | 3.1.2
react | 18.2.0
react-bootstrap | 2.7.4
react-dom | 18.2.0
react-responsive | 9.0.2
react-router-dom | 6.11.2
react-scripts | 5.0.1
react-toastify | 9.1.3
react-typing-effect | 2.0.5
socket.io | 4.6.1
socket.io-client | 4.6.1
styled-components | 5.3.11

### Directory

```
.
├── README.md
├── netlify.toml
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── api
    │   └── index.js
    ├── components
    │   ├── App.js
    │   ├── CopyButton.js
    │   ├── Loader.js
    │   ├── Navbar.js
    │   ├── Notification.js
    │   ├── OptionCard.js
    │   └── index.js
    ├── hooks
    │   └── index.js
    ├── images
    │   └── logo.png
    ├── index.js
    ├── pages
    │   ├── Dashboard.js
    │   ├── Error404.js
    │   ├── Home.js
    │   ├── Login.js
    │   ├── MyPolls.js
    │   ├── MyVotedPolls.js
    │   ├── NewPoll.js
    │   ├── Poll.js
    │   ├── PollResults.js
    │   ├── SignUp.js
    │   └── index.js
    ├── providers
    │   ├── Authprovider.js
    │   └── index.js
    ├── socket.js
    ├── styles
    │   ├── App.css
    │   ├── NewPoll.css
    │   ├── OptionCard.css
    │   ├── PollResults.css
    │   ├── index.css
    │   └── navbar.module.css
    └── utils
        └── index.js
```
  
