const NewProjectAnnouncementTemplate = (project, trainer) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
    
      <body>
        <section style="margin-bottom:10px;">Dear <span style="font-weight: bold;">${trainer.firstName} ${trainer.lastName}</span>,</sec>
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            color: #222;
          "
        >
          I hope this message finds you well.
          <section>
            We are thrilled to inform you about a new project opportunity that has
            just been posted, and we believe you would be an excellent fit.
          </section>
        </div>
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            color: #222;
          "
        >
          <h5 style="font-size: 20px">**Project Details:**</h5>
          <div style="font-size: 17px">
            Project Name - <span style="font-weight: bold">${project.title}</span>
          </div>
          <div style="font-size: 17px">
            Start Date - <span style="font-weight: bold">${project.startDate}</span>
          </div>
          <div style="font-size: 17px">
            End Date - <span style="font-weight: bold">${project.endDate}</span>
          </div>
          <div style="font-size: 17px">
            Location - <span style="font-weight: bold">${project.location}</span>
          </div>
          <div style="font-size: 17px">
            Priority - <span style="font-weight: bold">${project.priority}</span>
          </div>
          <div style="font-size: 17px">
            Duration - <span style="font-weight: bold">${project.span}</span>
          </div>
          <div style="font-size: 17px">
            Budget - <span style="font-weight: bold">${project.budget}</span>
          </div>
        </div>
        <div style="color: blue;margin: 10px 0px;">Apply here: http://localhost:3000/applypage</div>
        <div style="display: flex; align-items: center; margin-top: 40px">
          <section
            class="img-container"
            style="width: 96px; height: 141px; margin-right: 40px"
          >
            <img
              class="iCog-img"
              style="width: 100%; height: 100%"
              src="https://lh3.googleusercontent.com/tSmdUAo4Q0zCZBUdk4litv-S2NH7dZxerQ3JW_Hw0XBMmsEAkAIEZZ9RJhA0FToAFCfBXlGY5o87mOYZU7Z4OiBs5FLeSnMFs79UiFbn9G9TWIXXpan6Px8V20GdMJT565EdN89TGLwuul0QOg"
              alt="iCog-ACC"
            />
          </section>
          <span style="height: 141px; width: 1px; background-color: black"></span>
    
          <section class="content-container" style="padding-left: 10px">
            <div
              class="content-title"
              style="
                font-size: 19px;
                color: rgb(37, 151, 166);
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                font-weight: 700;
                margin-bottom: 6px;
              "
            >
              Human resources and management
            </div>
            <a
              class="icog-link"
              style="
                font-size: 14px;
                color: rgb(17, 85, 204);
                font-weight: 400;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
              "
              href="https://icogacc.com"
              >https://icogacc.com</a
            >
            <div
              class="icog-location"
              style="
                font-size: 14px;
                color: rgb(85, 85, 85);
                font-weight: 400;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                margin: 3px 0px;
              "
            >
              Namibia St, Lingo Tower, 12th Floor
            </div>
            <div
              class="icog-location"
              style="
                font-size: 14px;
                color: rgb(85, 85, 85);
                font-weight: 400;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                margin: 3px 0px;
              "
            >
              Addis Ababa, Ethiopia
            </div>
            <div class="social-media" style="margin: 3px 0px">
              <a href="https://twitter.com/iCog_ACC" target="_blank"
                ><img
                  src="https://lh5.googleusercontent.com/l3D3PXUM6rPbwzVo5J2bWr0xCRGgCBg78VuDsTX_xOTGVhL8DXPDeCXmnsLaFASdjnAtxsrKLU4FvgG3Fv0qNcBJESMNnBxGHPnI81UnWgBFTdciX-I-EvJpWk3uhG_iyvAXsNU7hfOW7gJH-A"
                  width="30"
                  height="30"
                  alt="twitter logo"
              /></a>
              <a href="https://instagram.com/icogacc/" target="_blank"
                ><img
                  src="https://lh6.googleusercontent.com/pMii7Rge2ie6FIVBTh9ltRdStW5B59VeNFQuvf551nPkrLi8FbzNIqZP29-jQb8wqJvtZGviRGujTTK87qZypGBs3Rn_AJsjhUIpgNUOZMohFaFJdyPvMhMFH8squ1pVW2orFE0_QLsOCKAJEw"
                  width="30"
                  height="30"
                  style="margin-right: 5px"
                  alt="instagram logo"
              /></a>
              <a
                href="https://www.linkedin.com/company/icog-anyone-can-code/mycompany/"
                target="_blank"
                ><img
                  src="https://lh5.googleusercontent.com/VAPPK1mlHVuLCqp2WW18AJYqwcwCRNLqfnvJAnkvhjDS6avnDGQ6jlP5xFQ7xvcSqoesATjF_-zhzhwqguzN53A4LPa4em-J1u8mK2s374HwgcRVSk6RCCufFzHXUL1tHCZvxDfwkoZVUQKqTA"
                  width="30"
                  height="30"
                  alt="instagram logo"
              /></a>
            </div>
          </section>
        </div>
      </body>
    </html>
    
    `;
};

const AdminAccessEmailTemplate = (user, generatePassword) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <div
        style="
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px;
          color: #222;
        "
      >
        <div style="margin: 10px 0px; color: #222;">Greetings,</div>
        <div style="color: #222;">
          Welcome to
          <span style="font-weight: bold">iCog-ACC.</span> As
          requested, we have created a trainer account for you.
        </div>
        
        <div style="margin: 10px 0px">
          Below are your login credentials:
  
          <section style="margin: 5px 20px">
            Email:
            <span style="font-weight: bold">${user.email}</span>
          </section>
          <section style="margin: 5px 20px">
            Temporary Password:
            <span style="font-weight: bold">${generatePassword}</span>
          </section>
        </div>
  <div 
  style="color: #222;">
  Please use the provided information to log in to your account. For
  security purposes, we strongly recommend changing your password after your
        initial login. 
        If you have any questions or need further assistance,
        please don't hesitate to contact your account provider at
        <span style="font-weight: bold">Contact</span>
        <div style="margin: 3px 0px">
          Thank you for being part of
          <span style="font-weight: bold">iCog-ACC</span>. We
          look forward to your contributions!
        </div>
        <div style="margin: 10px 0px">Best regards</div>
      </div>
      </div>
      <div style="display: flex; align-items: center; margin-top: 40px">
        <section
          class="img-container"
          style="width: 96px; height: 141px; margin-right: 40px"
        >
          <img
            class="iCog-img"
            style="width: 100%; height: 100%"
            src="https://lh3.googleusercontent.com/tSmdUAo4Q0zCZBUdk4litv-S2NH7dZxerQ3JW_Hw0XBMmsEAkAIEZZ9RJhA0FToAFCfBXlGY5o87mOYZU7Z4OiBs5FLeSnMFs79UiFbn9G9TWIXXpan6Px8V20GdMJT565EdN89TGLwuul0QOg"
            alt="iCog-ACC"
          />
        </section>
        <span style="height: 141px; width: 1px; background-color: black"></span>
  
        <section class="content-container" style="padding-left: 10px">
          <div
            class="content-title"
            style="
              font-size: 19px;
              color: rgb(37, 151, 166);
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              font-weight: 700;
              margin-bottom: 6px;
            "
          >
            Human resources and management
          </div>
          <a
            class="icog-link"
            style="
              font-size: 14px;
              color: rgb(17, 85, 204);
              font-weight: 400;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
            "
            href="https://icogacc.com"
            >https://icogacc.com</a
          >
          <div
            class="icog-location"
            style="
              font-size: 14px;
              color: rgb(85, 85, 85);
              font-weight: 400;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              margin: 3px 0px;
            "
          >
            Namibia St, Lingo Tower, 12th Floor
          </div>
          <div
            class="icog-location"
            style="
              font-size: 14px;
              color: rgb(85, 85, 85);
              font-weight: 400;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              margin: 3px 0px;
            "
          >
            Addis Ababa, Ethiopia
          </div>
          <div class="social-media" style="margin: 3px 0px">
            <a href="https://twitter.com/iCog_ACC" target="_blank"
              ><img
                src="https://lh5.googleusercontent.com/l3D3PXUM6rPbwzVo5J2bWr0xCRGgCBg78VuDsTX_xOTGVhL8DXPDeCXmnsLaFASdjnAtxsrKLU4FvgG3Fv0qNcBJESMNnBxGHPnI81UnWgBFTdciX-I-EvJpWk3uhG_iyvAXsNU7hfOW7gJH-A"
                width="30"
                height="30"
                alt="twitter logo"
            /></a>
            <a href="https://instagram.com/icogacc/" target="_blank"
              ><img
                src="https://lh6.googleusercontent.com/pMii7Rge2ie6FIVBTh9ltRdStW5B59VeNFQuvf551nPkrLi8FbzNIqZP29-jQb8wqJvtZGviRGujTTK87qZypGBs3Rn_AJsjhUIpgNUOZMohFaFJdyPvMhMFH8squ1pVW2orFE0_QLsOCKAJEw"
                width="30"
                height="30"
                style="margin-right: 5px"
                alt="instagram logo"
            /></a>
            <a
              href="https://www.linkedin.com/company/icog-anyone-can-code/mycompany/"
              target="_blank"
              ><img
                src="https://lh5.googleusercontent.com/VAPPK1mlHVuLCqp2WW18AJYqwcwCRNLqfnvJAnkvhjDS6avnDGQ6jlP5xFQ7xvcSqoesATjF_-zhzhwqguzN53A4LPa4em-J1u8mK2s374HwgcRVSk6RCCufFzHXUL1tHCZvxDfwkoZVUQKqTA"
                width="30"
                height="30"
                alt="instagram logo"
            /></a>
          </div>
        </section>
      </div>
    </body>
  </html>  
  `;
};

const ForgotPasswordCodeEmailTemplate = (user, code) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
  
    <body>
      <section>Dear <span style="font-weight: bold; ">${user.firstName} ${user.lastName}</span>,</sec>
      <div
        style="
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          color: #222;
          margin-top: 10px;
        "
      >
        
        <section >
          <section >
  
            You are receiving this email because you have requested to reset your password for your account with <span style="font-weight: bold;">iCog-ACC</span>. 
            <section style="margin-top: 10px;">
  
              To complete the password reset process, please use the following recovery code:
              <section>
              Recovery Code: 
              <span style="font-weight: bold;">
              
              ${code}
              </span>
              </section>
            </section>
          </section>
  
  <section style=" margin-top: 10px;">
  
    Please enter this recovery code in the password reset form on our website to proceed with resetting your password. Please note that this recovery code is valid for a limited time and should be used promptly.
    <section style="margin-top: 10px;">
  
      If you did not request a password reset or believe this email was sent to you in error, please disregard this message. Your account security is important to us, and we recommend taking appropriate measures to secure your account.
    </section>
    <section style="margin-top: 10px;">
  With regards,
    </section>
  </section>
        </section>
      </div>
      
      <div style="color: blue"></div>
      <div style="display: flex; align-items: center; margin-top: 40px">
        <section
          class="img-container"
          style="width: 96px; height: 141px; margin-right: 40px"
        >
          <img
            class="iCog-img"
            style="width: 100%; height: 100%"
            src="https://lh3.googleusercontent.com/tSmdUAo4Q0zCZBUdk4litv-S2NH7dZxerQ3JW_Hw0XBMmsEAkAIEZZ9RJhA0FToAFCfBXlGY5o87mOYZU7Z4OiBs5FLeSnMFs79UiFbn9G9TWIXXpan6Px8V20GdMJT565EdN89TGLwuul0QOg"
            alt="iCog-ACC"
          />
        </section>
        <span style="height: 141px; width: 1px; background-color: black"></span>
  
        <section class="content-container" style="padding-left: 10px">
          <div
            class="content-title"
            style="
              font-size: 19px;
              color: rgb(37, 151, 166);
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              font-weight: 700;
              margin-bottom: 6px;
            "
          >
            Human resources and management
          </div>
          <a
            class="icog-link"
            style="
              font-size: 14px;
              color: rgb(17, 85, 204);
              font-weight: 400;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
            "
            href="https://icogacc.com"
            >https://icogacc.com</a
          >
          <div
            class="icog-location"
            style="
              font-size: 14px;
              color: rgb(85, 85, 85);
              font-weight: 400;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              margin: 3px 0px;
            "
          >
            Namibia St, Lingo Tower, 12th Floor
          </div>
          <div
            class="icog-location"
            style="
              font-size: 14px;
              color: rgb(85, 85, 85);
              font-weight: 400;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              margin: 3px 0px;
            "
          >
            Addis Ababa, Ethiopia
          </div>
          <div class="social-media" style="margin: 3px 0px">
            <a href="https://twitter.com/iCog_ACC" target="_blank"
              ><img
                src="https://lh5.googleusercontent.com/l3D3PXUM6rPbwzVo5J2bWr0xCRGgCBg78VuDsTX_xOTGVhL8DXPDeCXmnsLaFASdjnAtxsrKLU4FvgG3Fv0qNcBJESMNnBxGHPnI81UnWgBFTdciX-I-EvJpWk3uhG_iyvAXsNU7hfOW7gJH-A"
                width="30"
                height="30"
                alt="twitter logo"
            /></a>
            <a href="https://instagram.com/icogacc/" target="_blank"
              ><img
                src="https://lh6.googleusercontent.com/pMii7Rge2ie6FIVBTh9ltRdStW5B59VeNFQuvf551nPkrLi8FbzNIqZP29-jQb8wqJvtZGviRGujTTK87qZypGBs3Rn_AJsjhUIpgNUOZMohFaFJdyPvMhMFH8squ1pVW2orFE0_QLsOCKAJEw"
                width="30"
                height="30"
                style="margin-right: 5px"
                alt="instagram logo"
            /></a>
            <a
              href="https://www.linkedin.com/company/icog-anyone-can-code/mycompany/"
              target="_blank"
              ><img
                src="https://lh5.googleusercontent.com/VAPPK1mlHVuLCqp2WW18AJYqwcwCRNLqfnvJAnkvhjDS6avnDGQ6jlP5xFQ7xvcSqoesATjF_-zhzhwqguzN53A4LPa4em-J1u8mK2s374HwgcRVSk6RCCufFzHXUL1tHCZvxDfwkoZVUQKqTA"
                width="30"
                height="30"
                alt="instagram logo"
            /></a>
          </div>
        </section>
      </div>
    </body>
  </html>
  `;
};

module.exports = {
  NewProjectAnnouncementTemplate,
  AdminAccessEmailTemplate,
  ForgotPasswordCodeEmailTemplate,
};
