### MedSafe: Preventing Healthcare Violence

This project is mainly based on different user types of different authorization levels, user and feedback databases, JWT verification etc.

## Watch the Demo: [HERE](https://drive.google.com/file/d/1h0n5rSi0wKTTIRiT-gr1Ci_0zBjnEwLA/view?usp=sharing)

In the past decade, violence in healthcare settings has seen a significant rise both globally and in Turkey. News reports of attacks on healthcare workers have unfortunately become a regular feature in Turkish media, highlighting the severity of the issue.

Although the Ministry of Health has introduced measures to combat this violence, such as the "White Code Program," [3] these efforts have proven insufficient. The White Code program offers three methods to report violence:
1.	Calling 1111 from an internal line at the hospital
2.	Calling the 113 Code White Call center
3.	Filling out a form at the www.beyazkod.saglik.gov website

However, these measures fail to fully address the complexities of the problem. In moments of escalating violence, victims often lack the time or capacity to make a call in which they effectively communicate the extent of the situation, let alone complete an online form. This delays critical communication between healthcare workers and law enforcement in situations where every second counts.

Furthermore, the program bypasses hospital administration by connecting healthcare providers directly to the Ministry. This omission prevents hospital administrators—who are better positioned to implement swift, tailored interventions—from addressing issues locally in a faster manner. Additionally, the program does not provide options for anonymous reporting, which may deter victims from coming forward.


## Functions

I.	Send immediate notifications to local and hospital law enforcement in cases of threats and attacks
To enhance the efficiency of incident reporting, MedSafe has an intuitive and rapid communication system. This system enables the swift transmission of critical information, such as the location of the incident, the required level of intervention, and the time of occurrence, ensuring timely and effective responses to emergencies from healthcare workers to authorities. MedSafe allows three levels of swift reporting so that in an emergency, users can send an immediate report with only one click. Level 1 denotes that the user feels unsafe though no event has occurred and to have people nearby. Level 2 is an immediate call to the local hospital security, usually in cases of verbal violence. Level 3 is an emergency call to both hospital security and law enforcement, referring to cases of bodily danger.

II.	Survey healthcare workers regularly about how they feel 
The system offers 24/7 feedback capabilities through a feedback survey page in the app, creating a formal and efficient channel for healthcare workers to share their thoughts, feelings, and impressions with the administration, who can view it in their dashboards. To encourage open communication, the system includes an option for anonymity, ensuring employees can voice their concerns without fear of repercussions.

III.	Deliver the survey results to the respective hospital administrations
The system provides feedback results given by the healthcare workers to hospital administrations in a clear, concise, and well-organized format. Each feedback features title, date of creation, user, and message parts, and is displayed in a tile.  The dashboard is scrollable and searchable, allowing users to find specific feedback using keywords, and offer filtering options by date and anonymity. This ensures the feedback is easily accessible and actionable, maximizing its value for decision-making.


## Pages

The web application itself is composed of the followung distinct forms, which are defined as structures created to meet the previously described functions of the system. These forms are the following:
a.	Hospital System Registration Page: This form is for a MedSafe employee to register a hospital administration into the MedSafe system after verifying the organization’s identity.
b.	Users & Previous Feedback & Reports & Master Dashboard(s): These forms are specifically for the admin administration account(s). The Master dashboard is the homepage and features tiles that are linked to 3 separate dashboards for viewing, editing, and filtering Users, Feedback, and Reports which each have their individual pages. These forms correspond to Function III. 
c.	Log-in & Set-Password Pages: These forms are for both the user and administration account types to initialize and access accounts. 
d.	Home Page & Level 1 & Level 2 & Level 3 Reporting Page(s): These forms are for healthcare worker accounts for them to swiftly initialize and, if necessary, make changes to their reports. Each of these forms have a Location component for users who aren’t in their primary locations to use and feature clearly labeled buttons, each indicating a specific threat level to help them convey their concerns accurately. These forms correspond to Functions I and IV.
e.	Share Feedback Page: This form is for users to provide feedback at any time. The "Share Feedback" button is conveniently positioned in the lower-right corner of the homepage to avoid obstructing the primary reporting buttons. Users have the option to submit feedback anonymously and include a title with detailed descriptions for clarity. This form corresponds to Function II.


 ## Hospital System
The initial step involves registering the hospital system, a process completed by a MedSafe representative after verifying the hospital's identity. A one-hour-valid activation link, secured using a signed JSON Web Token (JWT) via the bcrypt library, is sent to the hospital through the Nodemailer API. This link facilitates system activation and password setup.
The first email is assigned admin privileges for the initial user, which can later be adjusted as needed. During login sessions, a token is generated for the hospital system and stored as a cookie. This token enables MedSafe to validate the hospital system's identity before allowing any actions. The token is automatically invalidated upon logging out, ensuring secure access control.




## User
 The hospital administration's admin account has the authority to view, add, edit, and delete user accounts. When a new user is added, they must activate their account through an email sent via the Nodemailer API. This email contains a secure link embedded with a JSON Web Token (JWT) to facilitate account activation and password setup. 
During the registration process, the admin provides the user’s name, surname, email address, and assigns admin privileges if applicable. Additionally, the primary location of the healthcare worker—typically their office—is recorded.
Upon logging in, a token is generated for the user and stored as a cookie, enabling the MedSafe system to validate the user's identity for authorized actions. The token is automatically invalidated upon logout, ensuring secure and controlled access to the system.





## Feedback forms
Healthcare workers can submit feedback forms, which are then directed to the hospital administration's dashboard. These forms can be submitted anonymously, providing workers with a secure avenue to share their thoughts and concerns. Hospital administrators can view and manage this feedback, ensuring all input is appropriately addressed.
To enhance usability, the system incorporates advanced search and filter capabilities, enabling administrators to organize and retrieve feedback by user, keyword, date, or anonymity status. This ensures the feedback process is both efficient and actionable.
The user interface is built using the form, button, and collapse components of the React Bootstrap library, ensuring a smooth, responsive, and intuitive experience for both healthcare workers and administrators. The feedback data is managed using a Mongoose schema, ensuring structured and efficient storage within the MongoDB database. The feedback model includes:
•	title and body fields for the content of the feedback.
•	A reference to the user who submitted the feedback, enabling relational queries.
•	A createdAt field with a default timestamp for tracking submission dates.
•	An isAnonymous flag to indicate if the feedback was submitted anonymously.






## Reports
Healthcare workers can submit reports, which are directed to a separate dashboard system for hospital administration. Like feedback forms, reports are equipped with advanced search and filter functionalities, allowing administrators to organize and locate specific reports efficiently. These parameters include user, location, and date, ensuring streamlined management. Additionally, reports can be configured to be read aloud, enhancing accessibility and supporting scenarios where quick, hands-free access is necessary.
One critical concern addressed by the system is the potential for incidents to occur when a healthcare worker is outside their primary location. To mitigate this, the reporting interface includes a “Location” field (where users can specify their current location, ensuring that reports reflect accurate situational details.

The system manages report data using a Mongoose schema, which provides a structured format for storing and retrieving information from the MongoDB database. The report model includes the following fields:
level: Indicates the severity or urgency of the report as a numeric value.
location: Captures the location of the incident, allowing flexibility in reporting incidents outside the primary location.
user: A reference field that associates the report with the user who submitted it, supporting relational queries.
createdAt: Automatically timestamps the report submission for chronological tracking.




## Deployment:

As this MVP isn't deployed yet (and I haven't provided the .env file), it isn't possible to deploy it as of now. Yet, with the .env file this is how you would run on your localhost:

```cd client```
```npm run dev```

```cd server```
```npm start```
