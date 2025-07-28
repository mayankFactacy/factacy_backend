const axios = require("axios");
const { getAccessToken } = require("../utils/tokenManager");
const logger = require("../logger");
const dotenv= require('dotenv')
const path = require('path');
const config = require("../config/zohoConfig")

dotenv.config({
    path:path.resolve(__dirname,'.env')
});

// async function sendEmailToContact(recordId, token, contact) {
//   const emailPayload = {
//     data: [
//       {
//         from: {
//           user_name: config.user_name,
//           email: config.email,
//         },
//         to: [
//           {
//             user_name: contact.Last_Name || "User",
//             email: contact.Email,
//           },
//         ],
//         org_email: false,
//         subject: "Welcome!",
//         content: `<p>Hello ${contact.Last_Name},<br/>Welcome to our service.</p>`,
//         mail_format: "html",
//       },
//     ],
//   };

//   try {
//     const response = await axios.post(
//       `https://www.zohoapis.in/bigin/v2/Contacts/${recordId}/actions/send_mail`,
//       emailPayload,
//       {
//         headers: {
//           Authorization: `Zoho-oauthtoken ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     logger.info("Email sent Successfully");
//     return response.data;
//   } catch (error) {
//     logger.error(`Failed to send email: ${error.response?.data || error.message}`);
//   }
// }


async function searchOrCreateContact(req, res) {
  const {
    fullName,
    workEmail,
    countryCode = "",
    phoneNumber = "",
    companyName = "",
    yourRole = "",
    interest = [],
    requirement = "",
    urgency = "",
  } = req.body;

  if (!workEmail || !fullName) {
    logger.error("FullName and workEmail are required");
  }

  const [firstName, ...lastNameParts] = fullName.trim().split(" ");
  const lastName = lastNameParts.join(" ") || "-";

  const token = await getAccessToken();

  try {
    const searchResponse = await axios.get(
      "https://www.zohoapis.in/bigin/v2/Contacts/search",
      {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
        params: {
          criteria: `(Email:equals:${workEmail})`,
          fields: "Email,Last_Name,Mobile,Email_Opt_Out",
        },
      }
    );

    const contacts = searchResponse.data.data;

    if (contacts && contacts.length > 0) {
      const contact = contacts[0];
      const recordId = contact.id;

      logger.debug(`Contact found: ${recordId}`);
      // setTimeout(() => sendEmailToContact(recordId, token, contact), 3000);
      logger.info("Contact found.");
      return res.status(200).json({
        message: "Contact found.",
        contact,
      });
    }

    const createPayload = {
      data: [
        {
          First_Name: firstName,
          Last_Name: lastName,
          Email: workEmail,
          Mobile: `${countryCode} ${phoneNumber}`.trim(),
          Title: yourRole,
          Account_Name: {
            name: companyName,
          },
          Tag: interest.map((tag) => ({ name: tag })),
          Description: `Requirement: ${requirement}\nUrgency: ${urgency}`,
          Email_Opt_Out: false,
        },
      ],
    };

    const createResponse = await axios.post(
      "https://www.zohoapis.in/bigin/v2/Contacts",
      createPayload,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newContact = createResponse.data.data[0];
    const recordId = newContact.details.id;

    logger.info(`Contact Created: ${recordId}`);

    // setTimeout(() => {
    //   logger.debug("Sending email to new contact after delay..");
    //   sendEmailToContact(recordId, token, {
    //     Email: workEmail,
    //     Last_Name: lastName,
    //   });
    // }, 5000);

    logger.info("Contact created.");
    return res.status(201).json({
      message: "Contact created.",
      contact: newContact,
    });
  } catch (error) {
    logger.error(`Error processing contact ${error.response?.data || error.message}`);
    return res.status(500).json({
      error: "Error processing contact",
      details: error.response?.data || error.message,
    });
  }
}


module.exports = { searchOrCreateContact };
