"use strict";

let util = require('util');

let baseUrl = require('../../config/cf_host').domain;
let logo1 = require('../../utils/constant')._base_logo1_url;
let webName = require('../../utils/constant').webName;
let mailer = require('../mailer');
let language = require('../../../language/language_routes');
const defaultLanguage = language.defaultLanguage;

exports.verifyEmailUser = function (userName, email, link, lang) {
    let emailContent = getHeaderEmail(util.format(language.getLanguage('welcome_to_website', lang), ['EXT GROUP']))
        + getContentVerifyEMail(language.getLanguage('xac_minh_dia_cho_email_cua_ban_click_vao_ben_duoi', lang), link, lang);
    +getFooterEmail();

    mailer(email, util.format(language.getLanguage('vui_long_xac_thuc_email_cua_ban', lang), [userName]), emailContent, function (callback) {
    })
};

/**
 * @param email
 * @param userName
 * @param link
 * @param type
 */
exports.resetPassAccount = function (email, userName, link, type) {

    let emailContent = getHeaderEmail((type === 1) ? "RESET PASSWORD" : "RESET SECOND PASSWORD")
        + getContentEmailResetPass(userName, baseUrl + link, type);
    +getFooterEmail();

    mailer(email, `${webName}: Reset password`, emailContent, function (callback) {
    });
};


function getHeaderEmail(title) {
    return '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head> ' +
        '<meta charset="UTF-8"> ' +
        '<title>Document</title>' +
        '</head>' +
        '<body>' +
        '<div class="gmail_quote"> ' +
        '<div style="margin:0px;background-color:#f4f3f4;font-family:Helvetica,Arial,sans-serif;font-size:12px" ' +
        'text="#444444" bgcolor="#F4F3F4" link="#21759B" ' +
        'alink="#21759B" vlink="#21759B" marginheight="0" ' +
        'marginwidth="0"> <table border="0" width="100%" ' +
        'cellspacing="0" cellpadding="0" bgcolor="#F4F3F4">' +
        ' <tbody>' +
        ' <tr>' +
        ' <td style="padding:15px"> ' +
        '<center> ' +
        '<table width="550" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff"> ' +
        '<tbody> ' +
        '<tr> ' +
        '<td align="left">' +
        '<div style="border:solid 1px #d9d9d9"> ' +
        '<table style="line-height:1.6;font-size:12px;font-family:Helvetica,Arial,sans-serif;border:solid 1px #ffffff;color:#444" ' +
        'border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff"> ' +
        '<tbody> <tr> <td style="color:#ffffff" ' +
        'colspan="2" valign="bottom" height="30">.</td>' +
        '</tr>' +
        '<tr> ' +
        '<td style="line-height:25px;padding: 10px 20px; text-align: center">' +
        '<a style="text-decoration:none" href="' + baseUrl + '" target="_blank" ' +
        'class="CToWUd">' +
        '<img style="width: 200px" src="' + logo1 + '">' +
        '</a>' +
        '<h1 style="color: #2e3192; font-size: 30px; margin-bottom: 40px; text-align: center">' + title + '</h1>' +
        '</td>' +
        '</tr>' +
        '</tbody> ' +
        '</table> ' +
        '<table style="margin-top:15px;margin-right:30px;margin-left:30px;color:#444;line-height:1.6;font-size:12px;' +
        'font-family:Arial,sans-serif" border="0" width="490" ' +
        'cellspacing="0" cellpadding="0" bgcolor="#ffffff"> ';
}

function getContentVerifyEMail(message, link, lang) {
    return '<tbody>' +
        '<tr>' +
        '<td style="border-top:solid 1px #d9d9d9" colspan="2"> ' +
        '<div style="padding:15px 0; line-height: 1.6;">' +
        '<br><b style="font-size: 16px; text-align: center; display: block;">'+message+'</b>'+
        '<br>' +
        '<br><p style="text-align: center;"><a style="text-decoration: none; background: #2e3291; color: #fff; padding: 7px 25px; font-size: 15px; border-radius: 5px;" href="'+link+'">'+language.getLanguage('xac_nhan_dia_chi_email', lang)+'</a></p>' +
        '<br>' +
        '</div>' +
        '</td></tr></tbody>';
}

function getContentEmailResetPass(userName, link, type) {
    return '<tbody>' +
        '<tr>' +
        '<td style="border-top:solid 1px #d9d9d9" colspan="2"> ' +
        '<div style="padding:15px 0">' +
        '<p class="title" style="line-height: 1.7; font-size: 19px;">' + util.format(language.getLanguage((type === 1) ? 'reset_password_mail' : 'reset_second_password_mail', defaultLanguage), userName, link) + '</p>' +
        '<br>' +
        '</div>' +
        '</td></tr></tbody>';
}

function getFooterEmail() {
    return '</table> <table style="line-height:1.5;font-size:12px;font-family:Arial,' +
        'sans-serif;margin-right:30px;margin-left:30px" border="0" width="490" ' +
        'cellspacing="0" cellpadding="0" bgcolor="#ffffff"> ' +
        '<tbody> <tr style="font-size:11px;color:#999999">' +
        ' <td style="border-top:solid 1px #d9d9d9" colspan="2"> ' +
        '<div style="padding:15px 0"> This is automatic mailbox please do not Replied to this message! </div>' +
        '</td></tr><tr> <td style="color:#ffffff" colspan="2" height="15">.</td></tr></tbody> </table> ' +
        '</div></td></tr></tbody> </table> </center> </td></tr>' +
        '</tbody> </table> <div class="yj6qo"></div><div class="adL">' +
        '</div></div><div class="adL"></div></div></body></html>';
}