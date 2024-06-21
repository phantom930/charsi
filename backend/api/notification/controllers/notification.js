"use strict";
const admin = require("firebase-admin");
const _ = require("lodash");

const firebaseServiceAccount = require(`../../../config/${process.env.FIREBASE_SERVICE_ACCOUNT}`);

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const notificationBody = (data) => {
  const senderUserName = `${data.sender.username}`;
  const { bid, trade } = data;

  switch (data.type) {
    case "ChatMessages":
      return `${senderUserName} sent you a message`;
    case "PurchasedMyListing":
      return `${senderUserName} marked ${trade.listing_reward.title} as complete`;
    case "BidOnMyListing":
      return `${senderUserName} bid on ${bid.listing_reward.title}`;
    case "MyOfferAccepted":
      return `${senderUserName} accepted your offer on ${bid.listing_reward.title}`;
    case "MyOfferDeclined":
      return `${senderUserName} declined your offer on ${bid.listing_reward.title}`;
    case "MyRequestResponse":
      return `${senderUserName} responded to your request`;
    default:
      return "";
  }
};

const sendNotificationViaChat = async (db, data, additionalData) => {
  try {
    const { sender, recipient, type } = data;
    let chatRoom;
    const room1 = await db
      .collection("chatrooms")
      .where("sender", "==", String(sender.id))
      .where("recipient", "==", String(recipient.id))
      .get();
    const room2 = await db
      .collection("chatrooms")
      .where("recipient", "==", String(sender.id))
      .where("sender", "==", String(recipient.id))
      .get();
    if (!room1.empty) {
      chatRoom = room1.docs[0];
    } else if (!room2.empty) {
      chatRoom = room2.docs[0];
    } else {
      chatRoom = await db.collection("chatrooms").add({
        sender: String(sender.id),
        recipient: String(recipient.id),
        type: "DM",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await db.collection("chats").add({
      sender: String(sender.id),
      recipient: String(recipient.id),
      message: "",
      read: false,
      chatRoom: String(chatRoom.id),
      isNotification: true,
      notificationData: {
        sender: String(sender.id),
        recipient: String(recipient.id),
        type: type,
        data: additionalData,
      },
      created_at: new Date(),
      updated_at: new Date(),
    });
    await chatRoom.ref.update({
      updated_at: new Date(),
    });
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error);
  }
};

const emailTemplate = (data) => {
  const { sender, chatRoomID, bid, trade, tradeID } = data;
  const frontendURL =
    strapi.config.environment === "development"
      ? process.env.FRONTEND_DEVELOPMENT_URL
      : process.env.FRONTEND_PRODUCTION_URL;

  let emailBodyText = "";
  let emailBodyLink = "";
  let navigationButtonText = "";
  switch (data.type) {
    case "ChatMessages":
      emailBodyText = "You have a new chat message from";
      emailBodyLink = `${frontendURL}/chat#${chatRoomID}`;
      navigationButtonText = "View Message";
      break;
    case "PurchasedMyListing":
      emailBodyText = "Your listing has been purchased by";
      emailBodyLink = `${frontendURL}/account/past-trades#${trade.id}`;
      navigationButtonText = "Confirm Trade";
      break;
    case "BidOnMyListing":
      emailBodyText = "Your listing has been bid on by";
      emailBodyLink = `${frontendURL}/listing/${bid.listing_reward.id}#${bid.id}`;
      navigationButtonText = "View Bid";
      break;
    case "MyOfferAccepted":
      emailBodyText = `Your offer is accepted by`;
      emailBodyLink = `${frontendURL}/account/past-trades#${tradeID}`;
      navigationButtonText = "Confirm Trade";
      break;
    case "MyOfferDeclined":
      emailBodyText = `Your offer is declined by`;
      emailBodyLink = `${frontendURL}/listing/${bid.listing_reward.id}#${bid.id}`;
      navigationButtonText = "View Listing";
      break;
    case "MyRequestResponse":
      emailBodyText = `You have a new response to your request from`;
      break;
    default:
      emailBodyText = "";
      break;
  }

  return {
    subject: "Charsi Notification System",
    text: "",
    html: `
    <html><head>
      <meta content="width=device-width, initial-scale=1.0" name="viewport">
      <style type="text/css">
      /*** BMEMBF Start ***/
      /* CMS V4 Editor Test */
      [name=bmeMainBody]{min-height:1000px;}
      @media only screen and (max-width: 480px){table.blk, table.tblText, .bmeHolder, .bmeHolder1, table.bmeMainColumn{width:100% !important;} }
      @media only screen and (max-width: 480px){.bmeImageCard table.bmeCaptionTable td.tblCell{padding:0px 20px 20px 20px !important;} }
      @media only screen and (max-width: 480px){.bmeImageCard table.bmeCaptionTable.bmeCaptionTableMobileTop td.tblCell{padding:20px 20px 0 20px !important;} }
      @media only screen and (max-width: 480px){table.bmeCaptionTable td.tblCell{padding:10px !important;} }
      @media only screen and (max-width: 480px){table.tblGtr{ padding-bottom:20px !important;} }
      @media only screen and (max-width: 480px){td.blk_container, .blk_parent, .bmeLeftColumn, .bmeRightColumn, .bmeColumn1, .bmeColumn2, .bmeColumn3, .bmeBody{display:table !important;max-width:600px !important;width:100% !important;} }
      @media only screen and (max-width: 480px){table.container-table, .bmeheadertext, .container-table { width: 95% !important; } }
      @media only screen and (max-width: 480px){.mobile-footer, .mobile-footer a{ font-size: 13px !important; line-height: 18px !important; } .mobile-footer{ text-align: center !important; } table.share-tbl { padding-bottom: 15px; width: 100% !important; } table.share-tbl td { display: block !important; text-align: center !important; width: 100% !important; } }
      @media only screen and (max-width: 480px){td.bmeShareTD, td.bmeSocialTD{width: 100% !important; } }
      @media only screen and (max-width: 480px){td.tdBoxedTextBorder{width: auto !important;} }
      @media only screen and (max-width: 480px){th.tdBoxedTextBorder{width: auto !important;} }

      @media only screen and (max-width: 480px){table.blk, table[name=tblText], .bmeHolder, .bmeHolder1, table[name=bmeMainColumn]{width:100% !important;} }
      @media only screen and (max-width: 480px){.bmeImageCard table.bmeCaptionTable td[name=tblCell]{padding:0px 20px 20px 20px !important;} }
      @media only screen and (max-width: 480px){.bmeImageCard table.bmeCaptionTable.bmeCaptionTableMobileTop td[name=tblCell]{padding:20px 20px 0 20px !important;} }
      @media only screen and (max-width: 480px){table.bmeCaptionTable td[name=tblCell]{padding:10px !important;} }
      @media only screen and (max-width: 480px){table[name=tblGtr]{ padding-bottom:20px !important;} }
      @media only screen and (max-width: 480px){td.blk_container, .blk_parent, [name=bmeLeftColumn], [name=bmeRightColumn], [name=bmeColumn1], [name=bmeColumn2], [name=bmeColumn3], [name=bmeBody]{display:table !important;max-width:600px !important;width:100% !important;} }
      @media only screen and (max-width: 480px){table[class=container-table], .bmeheadertext, .container-table { width: 95% !important; } }
      @media only screen and (max-width: 480px){.mobile-footer, .mobile-footer a{ font-size: 13px !important; line-height: 18px !important; } .mobile-footer{ text-align: center !important; } table[class="share-tbl"] { padding-bottom: 15px; width: 100% !important; } table[class="share-tbl"] td { display: block !important; text-align: center !important; width: 100% !important; } }
      @media only screen and (max-width: 480px){td[name=bmeShareTD], td[name=bmeSocialTD]{width: 100% !important; } }
      @media only screen and (max-width: 480px){td[name=tdBoxedTextBorder]{width: auto !important;} }
      @media only screen and (max-width: 480px){th[name=tdBoxedTextBorder]{width: auto !important;} }

      @media only screen and (max-width: 480px){.bmeImageCard table.bmeImageTable{height: auto !important; width:100% !important; padding:20px !important;clear:both; float:left !important; border-collapse: separate;} }
      @media only screen and (max-width: 480px){.bmeMblInline table.bmeImageTable{height: auto !important; width:100% !important; padding:10px !important;clear:both;} }
      @media only screen and (max-width: 480px){.bmeMblInline table.bmeCaptionTable{width:100% !important; clear:both;} }
      @media only screen and (max-width: 480px){table.bmeImageTable{height: auto !important; width:100% !important; padding:10px !important;clear:both; } }
      @media only screen and (max-width: 480px){table.bmeCaptionTable{width:100% !important;  clear:both;} }
      @media only screen and (max-width: 480px){table.bmeImageContainer{width:100% !important; clear:both; float:left !important;} }
      @media only screen and (max-width: 480px){table.bmeImageTable td{padding:0px !important; height: auto; } }
      @media only screen and (max-width: 480px){img.mobile-img-large{width:100% !important; height:auto !important;} }
      @media only screen and (max-width: 480px){img.bmeRSSImage{max-width:320px; height:auto !important;} }
      @media only screen and (min-width: 640px){img.bmeRSSImage{max-width:600px !important; height:auto !important;} }
      @media only screen and (max-width: 480px){.trMargin img{height:10px;} }
      @media only screen and (max-width: 480px){div.bmefooter, div.bmeheader{ display:block !important;} }
      @media only screen and (max-width: 480px){.tdPart{ width:100% !important; clear:both; float:left !important; } }
      @media only screen and (max-width: 480px){table.blk_parent1, table.tblPart {width: 100% !important; } }
      @media only screen and (max-width: 480px){.tblLine{min-width: 100% !important;} }
      @media only screen and (max-width: 480px){.bmeMblCenter img { margin: 0 auto; } }
      @media only screen and (max-width: 480px){.bmeMblCenter, .bmeMblCenter div, .bmeMblCenter span  { text-align: center !important; text-align: -webkit-center !important; } }
      @media only screen and (max-width: 480px){.bmeNoBr br, .bmeImageGutterRow, .bmeMblStackCenter .bmeShareItem .tdMblHide { display: none !important; } }
      @media only screen and (max-width: 480px){.bmeMblInline table.bmeImageTable, .bmeMblInline table.bmeCaptionTable, .bmeMblInline { clear: none !important; width:50% !important; } }
      @media only screen and (max-width: 480px){.bmeMblInlineHide, .bmeShareItem .trMargin { display: none !important; } }
      @media only screen and (max-width: 480px){.bmeMblInline table.bmeImageTable img, .bmeMblShareCenter.tblContainer.mblSocialContain, .bmeMblFollowCenter.tblContainer.mblSocialContain{width: 100% !important; } }
      @media only screen and (max-width: 480px){.bmeMblStack> .bmeShareItem{width: 100% !important; clear: both !important;} }
      @media only screen and (max-width: 480px){.bmeShareItem{padding-top: 10px !important;} }
      @media only screen and (max-width: 480px){.tdPart.bmeMblStackCenter, .bmeMblStackCenter .bmeFollowItemIcon {padding:0px !important; text-align: center !important;} }
      @media only screen and (max-width: 480px){.bmeMblStackCenter> .bmeShareItem{width: 100% !important;} }
      @media only screen and (max-width: 480px){ td.bmeMblCenter {border: 0 none transparent !important;} }
      @media only screen and (max-width: 480px){.bmeLinkTable.tdPart td{padding-left:0px !important; padding-right:0px !important; border:0px none transparent !important;padding-bottom:15px !important;height: auto !important;} }
      @media only screen and (max-width: 480px){.tdMblHide{width:10px !important;} }
      @media only screen and (max-width: 480px){.bmeShareItemBtn{display:table !important;} }
      @media only screen and (max-width: 480px){.bmeMblStack td {text-align: left !important;} }
      @media only screen and (max-width: 480px){.bmeMblStack .bmeFollowItem{clear:both !important; padding-top: 10px !important;} }
      @media only screen and (max-width: 480px){.bmeMblStackCenter .bmeFollowItemText{padding-left: 5px !important;} }
      @media only screen and (max-width: 480px){.bmeMblStackCenter .bmeFollowItem{clear:both !important;align-self:center; float:none !important; padding-top:10px;margin: 0 auto;} }
      @media only screen and (max-width: 480px){
      .tdPart> table{width:100% !important;}
      }
      @media only screen and (max-width: 480px){.tdPart>table.bmeLinkContainer{ width:auto !important; } }
      @media only screen and (max-width: 480px){.tdPart.mblStackCenter>table.bmeLinkContainer{ width:100% !important;} }
      .blk_parent:first-child, .blk_parent{float:left;}
      .blk_parent:last-child{float:right;}
      /*** BMEMBF END ***/

      </style>
      <!--[if gte mso 9]>
      <xml>
      <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->

      <script async="" crossorigin="anonymous" src="https://edge.fullstory.com/s/fs.js"></script></head>
      <body topmargin="0" leftmargin="0" style="height: 100% !important; margin: 0; padding: 0; width: 100% !important;min-width: 100%;"><img src="https://clt1583130.benchmarkurl.com/c/o?e=16541FA&amp;c=18281A&amp;t=1&amp;l=B9162E38&amp;email=eCCVIvROz8ZMjwYc6mVyIASXAE%2FMRK6o&amp;relid=" alt="" border="0" style="display:none;" height="1" width="1">

      <table width="100%" cellspacing="0" cellpadding="0" border="0" name="bmeMainBody" style="background-color: rgb(134, 90, 255);" bgcolor="#865aff"><tbody><tr><td width="100%" valign="top" align="center">
      <table cellspacing="0" cellpadding="0" border="0" name="bmeMainColumnParentTable"><tbody><tr><td name="bmeMainColumnParent" style="border: 0px none transparent; border-radius: 0px; border-collapse: separate; overflow: visible; border-spacing: 0px;">
      <table name="bmeMainColumn" class="bmeMainColumn bmeHolder" style="max-width: 600px; overflow: visible; border-radius: 0px; border-collapse: separate; border-spacing: 0px; border-color: transparent; border-width: 0px; border-style: none;" cellspacing="0" cellpadding="0" border="0" align="center">    <tbody><tr id="section_1" class="flexible-section" data-columns="1" data-section-type="bmePreHeader"><td width="100%" class="blk_container bmeHolder" name="bmePreHeader" valign="top" align="center" style="color: rgb(102, 102, 102); border: 0px none transparent; background-color: rgb(208, 191, 255);" bgcolor="#d0bfff"></td></tr> <tr><td width="100%" class="bmeHolder" valign="top" align="center" name="bmeMainContentParent" style="border: 0px none transparent; border-radius: 0px; border-collapse: separate; border-spacing: 0px; overflow: hidden;">
      <table name="bmeMainContent" style="border-radius: 0px; border-collapse: separate; border-spacing: 0px; border: 0px none transparent; overflow: visible;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center"> <tbody><tr id="section_2" class="flexible-section" data-columns="1"><td width="100%" class="blk_container bmeHolder" name="bmeHeader" valign="top" align="center" style="color: rgb(56, 56, 56); border: 0px none transparent; background-color: rgb(134, 90, 255);" bgcolor="#865AFF"><div id="dv_7" class="blk_wrapper" style="">
      <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_image"><tbody><tr><td>
      <table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td align="center" class="bmeImage" style="border-collapse: collapse;padding-left:20px; padding-right: 20px;padding-top:20px; padding-bottom: 20px; "><img src="https://images.benchmarkemail.com/client1583130/image14054845.png" width="185" style="max-width: 185px; display: block; border-radius: 0px;" alt="" data-radius="0" border="0" data-original-max-width="185"></td></tr></tbody>
      </table></td></tr></tbody>
      </table></div>
      </td></tr> <tr id="section_3" class="flexible-section" data-columns="1"><td width="100%" class="blk_container bmeHolder bmeBody" name="bmeBody" valign="top" align="center" style="color: rgb(56, 56, 56); border: 0px none transparent; background-color: rgb(255, 255, 255);" bgcolor="#ffffff"><div id="dv_3" class="blk_wrapper" style="">
      <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_image"><tbody><tr><td>
      <table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td align="center" class="bmeImage" style="border-collapse: collapse; padding: 20px 0px;"><img src="https://images.benchmarkemail.com/client1583130/image14054874.png" width="71.7" style="max-width: 71.7px; display: block; border-radius: 0px;" alt="" data-radius="0" border="0" data-original-max-width="256" class="keep-custom-width" data-customwidth="28"></td></tr></tbody>
      </table></td></tr></tbody>
      </table></div>


      <div id="dv_8" class="blk_wrapper" style="">
      <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_text"><tbody><tr><td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="bmeContainerRow"><tbody><tr><th class="tdPart" valign="top" align="center">
      <table cellspacing="0" cellpadding="0" border="0" width="600" name="tblText" class="tblText" style="float:left; background-color:transparent;" align="left"><tbody><tr><td valign="top" align="left" name="tblCell" class="tblCell" style="padding: 10px 20px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; color: rgb(56, 56, 56); text-align: left; word-break: break-word;">
      <table>
      <tbody>
      <tr>
      <td>
      <div style="line-height: 100%;"><span style="line-height: 100%;"><strong>&nbsp; &nbsp; &nbsp; &nbsp; </strong><span style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; line-height: 100%;"><strong>${emailBodyText}</strong></span><strong>&nbsp;</strong></span></div>
      </td>
      <td><img style="max-width: 1px;" src="https://images.benchmarkemail.com/client1583130/image14054914.png" alt="" width="1" border="0"></td>
      <td align="center"><img style="vertical-align: middle; max-width: 44px; border-radius: 50%;" src="${_.get(
        sender,
        "avatar.url",
        ""
      )}" alt="" width="44" border="0" imgid="imgJdQfqsegNpH5" uniqueid="JdQfqsegNpH5" data-original-max-width="44"> <strong>&nbsp;<span style="font-size: 30px; line-height: 1; vertical-align: middle;">${
      sender.username
    }</span></strong></td>
      </tr>
      </tbody>

      </table>
      <div style="line-height: 100%;">&nbsp;</div></td></tr></tbody>
      </table></th></tr></tbody>
      </table></td></tr></tbody>
      </table></div></td></tr> <tr id="section_4" class="flexible-section" data-columns="1"><td width="100%" class="blk_container bmeHolder" name="bmePreFooter" valign="top" align="center" style="border: 0px none transparent; background-color: rgb(255, 255, 255);" bgcolor="#ffffff">

      <div id="dv_6" class="blk_wrapper" style="">
      <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_text"><tbody><tr><td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="bmeContainerRow"><tbody><tr><th class="tdPart" valign="top" align="center">
      <table cellspacing="0" cellpadding="0" border="0" width="600" name="tblText" class="tblText" style="float:left; background-color:transparent;" align="left"><tbody><tr><td valign="top" align="left" name="tblCell" class="tblCell" style="padding: 10px 20px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; color: rgb(56, 56, 56); text-align: left; word-break: break-word;"><div style="line-height: 150%; text-align: center;"><span style="font-family: Helvetica, Arial, sans-serif; color: rgb(127, 127, 127);">Log in to Charsi&nbsp;view the message!</span></div></td></tr></tbody>
      </table></th></tr></tbody>
      </table></td></tr></tbody>
      </table></div><div id="dv_4" class="blk_wrapper" style="">
      <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_button" style=""><tbody><tr><td width="30"></td><td align="center">
      <table class="tblContainer" cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr><td height="20"></td></tr><tr><td align="center">
      <table cellspacing="0" cellpadding="0" border="0" class="bmeButton" align="center" style="border-collapse: separate;"><tbody><tr><td style="border-radius: 32px; border-width: 0px; border-style: none; border-image: initial; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 14px; padding: 10px 30px; font-weight: bold; background-color: rgb(134, 90, 255);  border-collapse: separate;word-break: break-word;" class="bmeButtonText"><span style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: rgb(255, 255, 255);"><a style="color:#FFFFFF;text-decoration:none;text-transform:uppercase;" target="_blank" href="${emailBodyLink}" data-link-type="web" draggable="false">${navigationButtonText}</a></span></td></tr></tbody>
      </table></td></tr><tr><td height="20"></td></tr></tbody>
      </table></td><td width="30"></td></tr></tbody>
      </table></div></td></tr> </tbody>
      </table> </td></tr>  <tr id="section_5" class="flexible-section" data-columns="1" data-section-type="bmeFooter"><td width="100%" class="blk_container bmeHolder" name="bmeFooter" valign="top" align="center" style="color: rgb(102, 102, 102); border: 0px none transparent;" bgcolor=""><div id="dv_2" class="blk_wrapper" style="">
      <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_footer" style=""><tbody><tr><td name="tblCell" class="tblCell" style="padding: 20px; word-break: break-word;" valign="top" align="left">
      <table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr><td name="bmeBadgeText" style="text-align:center; word-break: break-word;" align="center"><span id="spnFooterText" style="font-family: Helvetica, Arial, sans-serif; font-weight: normal; font-size: 11px; line-height: 140%; color: rgb(255, 255, 255);">
      <br><center>
      © Charsi 2023

      <br>
      <a href="" style="color:#fff; display:inline-block; margin-top: 4px;">Terms of Service</a>
      </center></span>
      </td></tr></tbody>
      </table></td></tr></tbody>
      </table></div></td></tr> </tbody>
      </table></td></tr></tbody>
      </table></td></tr></tbody>
      </table>
      <!-- /Test Path -->

      </body></html>
  `,
  };
};

const sendNewNotification = async (data) => {
  const { sender, recipient, type } = data;

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseServiceAccount),
      });
    }

    const additionalData = (() => {
      const { bid, tradeID, trade } = data;
      switch (type) {
        case "ChatMessages":
          return {
            chatRoomID: data.chatRoomID,
          };
        case "PurchasedMyListing":
          return {
            listing_reward: {
              id: trade.listing_reward.id,
              title: trade.listing_reward.title,
            },
            tradeID: trade.id,
          };
        case "BidOnMyListing":
          return {
            bidID: bid.id,
            listing_reward: {
              id: bid.listing_reward.id,
              title: bid.listing_reward.title,
            },
          };
        case "MyOfferAccepted":
          return {
            bidID: bid.id,
            listing_reward: {
              id: bid.listing_reward.id,
              title: bid.listing_reward.title,
            },
            tradeID: tradeID,
          };
        case "MyOfferDeclined":
          return {
            bidID: bid.id,
            listing_reward: {
              id: bid.listing_reward.id,
              title: bid.listing_reward.title,
            },
          };
        case "MyRequestResponse":
          return {};
        default:
          return {};
      }
    })();

    const notification = await strapi.services.notification.create({
      sender: sender.id,
      recipient: recipient.id,
      type: type,
      data: additionalData,
      created_by: sender.id,
      updated_by: sender.id,
    });

    const notificationSetting = recipient.notificationSettings[type];
    if (notificationSetting.browser) {
      // Send notification via browser
      const db = admin.firestore();
      const messaging = admin.messaging();

      if (!recipient.fcmRegistrationToken) {
        throw new Error("Recipient does not have FCM registration token.");
      }

      const message = {
        token: recipient.fcmRegistrationToken,
        data: {
          title: "Charsi Notification",
          body: notificationBody(data),
          type: type,
          notificationID: String(notification.id),
        },
      };

      await messaging.send(message);
      if (type !== "ChatMessages")
        await sendNotificationViaChat(db, data, additionalData);
    }

    if (notificationSetting.text) {
      // Send notification via sms
      if (!recipient.phoneNumber) {
        throw new Error("Recipient does not have phone number.");
      }

      // const twilioClient = strapi.controllers.twilio.twilioClient;
      // console.log("twilio: ", twilioClient);

      // await twilioClient.messages.create({
      //   body: notificationBody(data),
      //   from: me.phoneNumber,
      //   to: recipient.phoneNumber,
      // });
    }

    if (notificationSetting.email) {
      // Send notification via email

      if (!recipient.email) {
        throw new Error("Recipient does not have email.");
      }

      const emailBody = emailTemplate(data);
      await strapi.plugins.email.services.email.sendTemplatedEmail(
        {
          to: recipient.email,
        },
        emailBody
      );
    }

    return notification;
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};
module.exports = {
  sendNewNotification: sendNewNotification,
  sendChatNotification: async (ctx) => {
    const { recipientID, chatRoomID } = ctx.request.body;
    const { user } = ctx.state;

    try {
      const me = await strapi
        .query("user", "users-permissions")
        .findOne({ id: user.id });
      const recipient = await strapi
        .query("user", "users-permissions")
        .findOne({ id: recipientID });

      if (!recipient.fcmRegistrationToken) {
        throw new Error("Recipient does not have FCM registration token.");
      }

      await sendNewNotification({
        sender: me,
        recipient: recipient,
        type: "ChatMessages",
        chatRoomID: chatRoomID,
      });

      return true;
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },
};
