import nodemailar from 'nodemailer';
export const sendEmail= async ({to,subject,html,attachments})=>{
    //sender inforamation
const transporter= nodemailar.createTransport({
    host:"localhost",
    port:465,
    secure:true,
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAILPASS
    }
})
 const  info= await transporter.sendMail({
    from:`"RoteeAcademy"<${process.env.EMAIL}>`,
    to,
    subject,
    html,
    attachments,

 })

return info.accepted.length<1 ?false : true





}