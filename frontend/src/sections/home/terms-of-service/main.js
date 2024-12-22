import React from "react";
import { Typography } from '@mui/material';
import CircleIcon from "@mui/icons-material/Circle";

export default function Main() {
    return (
        <div className="w-full flex flex-col gap-[48px] p-[24px] sm:gap-[40px] sm:p-[60px]">
            <div className="w-full flex flex-col gap-[20px]">
                <Typography variant="h5" className="w-full text-center font-bold">TERMS OF SERVICE</Typography>
                <Typography variant="h6" className="font-gilroyMedium">Updated: October 15, 2024</Typography>
                <Typography variant="h6" className="font-gilroyMedium">AGREEMENT TO OUR LEGAL TERMS</Typography>
                <Typography variant="subtitle1">Welcome to Pickup Pointe, LLC.., doing business as PickupPointe.com ("Company," "we," "us," "our"), a company registered in Delaware. We operate the website www.pickuppointe.com (the "Site"), and any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").</Typography>
                <div className="flex flex-col gap-[20px]">
                    <Typography variant="h6" className="font-gilroyMedium">Contact Information:</Typography>
                    <div className="flex flex-col gap-[5px] pl-5">
                        <div className="flex items-center gap-[10px]">
                            <CircleIcon className="text-[8px]" />
                            <Typography variant="subtitle1"><strong>Email:</strong> support@pickuppointe.com</Typography>
                        </div>
                        <div className="flex items-center gap-[10px]">
                            <CircleIcon className="text-[8px]" />
                            <Typography variant="subtitle1"><strong>Mailing Address:</strong> 1317 Edgewater Dr. #3624, Orlando FL 32804, United States</Typography>
                        </div>
                    </div>
                </div>
                <Typography variant="subtitle1">These Legal Terms constitute a legally binding agreement between you, whether personally or on behalf of an entity ("you"), and Pickup Pointe, Inc., concerning your access to and use of the Services. By accessing the Services, you agree that you have read, understood, and agreed to be bound by all these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</Typography>
                <Typography variant="subtitle1">We will notify you of any scheduled changes to the Services. The modified Legal Terms will become effective upon posting or notifying you via email at support@pickuppointe.com. By continuing to use the Services after the effective date of any changes, you agree to be bound by the modified terms.</Typography>
                <Typography variant="subtitle1">The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.</Typography>
                <Typography variant="subtitle1">We recommend that you print a copy of these Legal Terms for your records.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">1. OUR SERVICES</Typography>
                <Typography variant="subtitle1">The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.</Typography>
                <Typography variant="subtitle1">The Services are not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use the Services. You may not use the Services in a way that would violate the Gramm-Leach-Bliley Act (GLBA).</Typography>
                <Typography variant="h6" className="font-gilroyMedium">2. INTELLECTUAL PROPERTY RIGHTS</Typography>
                <Typography variant="subttiel1" className="font-bold">Our Intellectual Property</Typography>
                <Typography variant="subttiel1">We own or license all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").</Typography>
                <Typography variant="subttiel1">Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the United States and around the world.</Typography>
                <Typography variant="subttiel1">The Content and Marks are provided "AS IS" for your personal, non-commercial use or internal business purpose only.</Typography>
                <Typography variant="subttiel1" className="font-bold">Your Use of Our Services</Typography>
                <Typography variant="subttiel1">Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:</Typography>
                <div className="flex flex-col gap-[5px] pl-5">
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Access the Services.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use or internal business purpose.</Typography>
                    </div>
                </div>
                <Typography variant="subttiel1">Except as set out in this section or elsewhere in our Legal Terms, no part of the Services, Content, or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.</Typography>
                <Typography variant="subttiel1">If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: support@pickuppointe.com.</Typography>
                <Typography variant="subttiel1">If we ever grant you permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.</Typography>
                <Typography variant="subttiel1">We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.</Typography>
                <Typography variant="subttiel1">Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.</Typography>
                <Typography variant="subttiel1" className="font-bold">Your Submissions and Contributions</Typography>
                <Typography variant="subttiel1">Please review this section and the "PROHIBITED ACTIVITIES" section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.</Typography>
                <Typography variant="subttiel1">
                    <strong>Submissions:</strong> By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.<br/>
                </Typography>
                <Typography variant="subttiel1">
                    <strong>Contributions:</strong> The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, during which you may create, submit, post, display, transmit, publish, distribute, or broadcast content and materials to us or through the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, reviews, rating suggestions, personal information, or other material ("Contributions"). Any Submission that is publicly posted shall also be treated as a Contribution.<br/>
                </Typography>
                <Typography variant="subttiel1">You understand that Contributions may be viewable by other users of the Services and possibly through third-party websites. When you post Contributions, you grant us a license (including use of your name, trademarks, and logos): By posting any Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to: use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle, store, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), adapt, and incorporate your Contributions, including without limitation your name, image, and voice for any purpose, commercial, advertising, or otherwise, to prepare derivative works of, or incorporate into other works, your Contributions, and to sublicense the licenses granted in this section. Our use and distribution may occur in any media formats and through any media channels.</Typography>
                <Typography variant="subttiel1">This license includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide.</Typography>
                <Typography variant="subttiel1" className="font-bold">You Are Responsible for What You Post or Upload:</Typography>
                <Typography variant="subttiel1">By sending us Submissions and/or posting Contributions through any part of the Services or making Contributions accessible through the Services by linking your account through the Services to any of your social networking accounts, you:</Typography>
                <div className="flex flex-col gap-[5px] pl-5">
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Confirm that you have read and agree with our "PROHIBITED ACTIVITIES" and will not post, send, publish, upload, or transmit through the Services any Submission nor post any contribution that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Confirm that you have any applicable license, waiver, and any all moral rights to any such Submission and/or Contribution.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Warrant that any such Submission and/or Contributions are original to you or that you have the necessary rights and licenses to submit such Submissions and/or Contributions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions and/or Contributions.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Warrant and represent that your Submissions and/or Contributions do not constitute confidential information.</Typography>
                    </div>
                </div>
                <Typography variant="subttiel1">You are solely responsible for your Submissions and/or Contributions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party's intellectual property rights, or (c) applicable law.</Typography>
                <Typography variant="subttiel1" className="font-bold">We May Remove or Edit Your Content:</Typography>
                <Typography variant="subttiel1">Although we have no obligation to monitor any Contributions, we shall have the right to remove or edit any Contributions at any time without notice if in our reasonable opinion we consider such Contributions harmful or in breach of these Legal Terms. If we remove or edit any such Contributions, we may also suspend or disable your account and report you to the authorities.</Typography>
                <Typography variant="subttiel1"><strong>Copyright Infringement:</strong> We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately refer to the "DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY" section below.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">3. USER REPRESENTATIONS</Typography>
                <Typography variant="subttiel1">By using our Services, you represent and warrant that:</Typography>
                <div className="flex flex-col gap-[5px] pl-5">
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">All registration information you submit will be true, accurate, current, and complete.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">You will maintain the accuracy of such information and promptly update it as necessary.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">You have the legal capacity and agree to comply with these Legal Terms.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">You are not a minor in the jurisdiction in which you reside.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">You will not access the Services through automated or non-human means, whether through a bot, script, or otherwise.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">You will not use the Services for any illegal or unauthorized purpose.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your use of the Services will not violate any applicable law or regulation.</Typography>
                    </div>
                </div>
                <Typography variant="subttiel1">If you provide any information that is untrue, inaccurate, not current, or incomplete, we reserve the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).</Typography>
                <Typography variant="h6" className="font-gilroyMedium">4. USER REGISTRATION</Typography>
                <Typography variant="subttiel1">You may be required to register to use the Services. You agree to keep your password confidential and are responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">5. PURCHASES AND PAYMENT</Typography>
                <Typography variant="subttiel1">We accept the following forms of payment:</Typography>
                <div className="flex flex-col gap-[5px] pl-5">
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Visa</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Mastercard</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">American Express</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Discover</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Apple Pay</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Google Pay</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Link Pay</Typography>
                    </div>
                </div>
                <Typography variant="subttiel1">You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in US dollars.</Typography>
                <Typography variant="subttiel1">You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping fees, and you authorize us to charge your chosen payment provider for any such amounts upon placing your order. If your order is subject to recurring charges, you consent to our charging your payment method on a recurring basis without requiring your prior approval for each recurring charge until such time as you cancel the applicable order. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.</Typography>
                <Typography variant="subttiel1">We reserve the right to refuse any order placed through the Services. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers, or distributors.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">6. CANCELLATION</Typography>
                <Typography variant="subttiel1">You can cancel your subscription at any time by contacting us using the contact information provided below. Your cancellation will take effect at the end of the current paid term. If you are unsatisfied with our Services, please email us at support@pickuppointe.com</Typography>
                <Typography variant="h6" className="font-gilroyMedium">7. PROHIBITED ACTIVITIES</Typography>
                <Typography variant="subttiel1">As a user of Pickup Pointe Services, you agree not to:</Typography>
                <div className="flex flex-col gap-[5px] pl-5">
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Use any information obtained from the Services in order to harass, abuse, or harm another person.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Make improper use of our support services or submit false reports of abuse or misconduct.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Use the Services in a manner inconsistent with any applicable laws or regulations.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Engage in unauthorized framing of or linking to the Services.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Delete the copyright or other proprietary rights notice from any Content.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Attempt to impersonate another user or person or use the username of another user.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ("gifs"), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as "spyware" or "passive collection mechanisms" or "pcms").</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or use or launch any unauthorized script or other software.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Use a buying agent or purchasing agent to make purchases on the Services.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.</Typography>
                    </div>
                </div>
                <Typography variant="h6" className="font-gilroyMedium">8. USER GENERATED CONTRIBUTIONS</Typography>
                <Typography variant="subttiel1">Pickup Pointe’s Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality. You may be provided with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that:</Typography>
                <div className="flex flex-col gap-[5px] pl-5">
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.
                        </Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and these Legal Terms.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and these Legal Terms.
                        </Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions are not false, inaccurate, or misleading.
                        </Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.
                        </Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.
                        </Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions do not violate any applicable law, regulation, or rule.</Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions do not violate the privacy or publicity rights of any third party.
                        </Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors.
                        </Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.
                        </Typography>
                    </div>
                    <div className="flex gap-[10px]">
                        <CircleIcon className="text-[8px] mt-[10px]" />
                        <Typography variant="subtitle1">Your Contributions do not otherwise violate, or link to material that violates, any provision of these Legal Terms, or any applicable law or regulation.</Typography>
                    </div>
                </div>
                <Typography variant="subttiel1">Any use of the Services in violation of the foregoing violates these Legal Terms and may result in, among other things, termination or suspension of your rights to use the Services.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">9. CONTRIBUTION LICENSE</Typography>
                <Typography variant="subttiel1">By posting any Contributions on Pickup Pointe, you automatically grant us a broad license to use your content. This includes the right to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, publicly perform, publicly display, reformat, translate, transmit, and distribute your Contributions (including your image and voice) worldwide, in any media or format, now known or later developed. This license is irrevocable, perpetual, non-exclusive, transferable, royalty-free, and fully paid.</Typography>
                <Typography variant="subttiel1">This license also allows us to create derivative works from your Contributions and sublicense these rights to others. You waive all moral rights in your Contributions and confirm that you have the authority to grant these rights to us. You retain ownership of your Contributions, but you agree not to hold us liable for any use of your Contributions. You are solely responsible for your Contributions, and you agree to indemnify us against any claims related to your Contributions.
                </Typography>
                <Typography variant="subttiel1">We reserve the right to edit, categorize, or remove any Contributions at our discretion, without notice. We are not obligated to monitor your Contributions.
                </Typography>
                <Typography variant="h6" className="font-gilroyMedium">10. THIRD-PARTY WEBSITES AND CONTENT</Typography>
                <Typography variant="subttiel1">Pickup Pointe may contain links to third-party websites and content, which we do not control or monitor for accuracy or appropriateness. We are not responsible for any third-party websites accessed through our Services or any third-party content available through our Services. The inclusion of such links does not imply our endorsement. If you access third-party websites or content, you do so at your own risk and should review their terms and policies. We are not liable for any harm or losses arising from your use of third-party websites or content.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">11. SERVICES MANAGEMENT</Typography>
                <Typography variant="subttiel1">We reserve the right to:</Typography>
                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }} className="ml-5">
                    <li className="text-[16px]">Monitor the Services for violations of these Legal Terms.</li>
                    <li className="text-[16px]">Take legal action against anyone violating the law or these Legal Terms, including reporting such users to law enforcement.</li>
                    <li className="text-[16px]">Restrict access to, limit availability of, or disable any Contributions that violate these terms, at our discretion.</li>
                    <li className="text-[16px]">Remove or disable files and content that are excessively large or burdensome to our systems.</li>
                    <li className="text-[16px]">Manage the Services to protect our rights and property and ensure the proper functioning of the Services.</li>
                </ol>
                <Typography variant="h6" className="font-gilroyMedium">12. PRIVACY POLICY</Typography>
                <Typography variant="subttiel1">Your privacy is important to us. By using Pickup Pointe, you agree to our Privacy Policy, which is incorporated into these Legal Terms. Our Services are hosted in the United States. If you access our Services from outside the United States, you consent to your data being transferred to and processed in the United States. Please review our Privacy Policy for more details on how we handle your data.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY</Typography>
                <Typography variant="h6" className="font-gilroyMedium">Notifications</Typography>
                <Typography variant="subttiel1">We at Pickup Pointe respect the intellectual property rights of others. If you believe that any material available on or through our Services infringes upon any copyright you own or control, please immediately notify our Designated Copyright Agent using the contact information provided below ("Notification"). We will send a copy of your Notification to the person who posted the material. Be aware that you may be held liable for damages if you make material misrepresentations in a Notification. If you are unsure, consider consulting an attorney.
                </Typography>
                <Typography variant="subttiel1">To be effective, your Notification must include:</Typography>
                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }} className="ml-5">
                    <li className="text-[16px]">A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright.</li>
                    <li className="text-[16px]">Identification of the copyrighted work claimed to have been infringed, or a representative list if multiple works are involved.</li>
                    <li className="text-[16px]">Identification of the material claimed to be infringing, and information reasonably sufficient to permit us to locate the material.</li>
                    <li className="text-[16px]">Your contact information, such as an address, telephone number, and email address.</li>
                    <li className="text-[16px]">A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
                    <li className="text-[16px]">A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                </ol>
                <Typography variant="h6" className="font-gilroyMedium">Counter Notification</Typography>
                <Typography variant="subttiel1">If you believe your own copyrighted material has been removed as a result of a mistake or misidentification, you may submit a written counter notification to our Designated Copyright Agent using the contact information provided below ("Counter Notification"). Your Counter Notification must include:</Typography>
                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }} className="ml-5">
                    <li className="text-[16px]">Identification of the material that has been removed and the location where it appeared before it was removed.</li>
                    <li className="text-[16px]">A statement consenting to the jurisdiction of the Federal District Court in which your address is located, or any judicial district in which we are located if your address is outside the United States.</li>
                    <li className="text-[16px]">A statement that you will accept service of process from the party that filed the Notification or the party's agent.</li>
                    <li className="text-[16px]">Your name, address, and telephone number.</li>
                    <li className="text-[16px]">A statement under penalty of perjury that you have a good faith belief that the material was removed as a result of a mistake or misidentification.</li>
                    <li className="text-[16px]">Your physical or electronic signature.</li>
                </ol>
                <Typography variant="subttiel1">Upon receiving a valid Counter Notification, we will restore the removed material unless the party filing the Notification informs us that they have filed a court action to restrain you from engaging in infringing activity related to the material in question. Be aware that filing a false Counter Notification may subject you to liability for damages, including costs and attorney's fees.
                </Typography>
                <Typography variant="h6" className="font-gilroyMedium">Designated Copyright Agent</Typography>
                <ul>
                    <li className="text-[16px]">Pickup Pointe, Inc.</li>
                    <li className="text-[16px]">Attn: Copyright Agent</li>
                    <li className="text-[16px]">1317 Edgewater Dr. #3624,</li>
                    <li className="text-[16px]">Orlando FL 32804</li>
                    <li className="text-[16px]">United States</li>
                    <li className="text-[16px]">legal@pickuppointe.com</li>
                </ul>
                <Typography variant="h6" className="font-gilroyMedium">TERM AND TERMINATION</Typography>
                <Typography variant="subttiel1">These Legal Terms remain in full force and effect while you use the Services. We reserve the right, at our sole discretion and without notice or liability, to deny access to and use of the Services, including blocking certain IP addresses, to any person for any reason or no reason, including for breach of any representation, warranty, or covenant contained in these Legal Terms or any applicable law or regulation. We may terminate your use or participation in the Services or delete your account and any content or information that you posted at any time, without warning.</Typography>
                <Typography variant="subttiel1">If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.
                </Typography>
                <Typography variant="h6" className="font-gilroyMedium">MODIFICATIONS AND INTERRUPTIONS</Typography>
                <Typography variant="subttiel1">We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.</Typography>
                <Typography variant="subttiel1">We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">GOVERNING LAW</Typography>
                <Typography variant="subttiel1">These Legal Terms and your use of Pickup Pointe’s Services are governed by the laws of Delaware. Any disputes will be interpreted in line with Delaware law without considering its conflict of law principles.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">DISPUTE RESOLUTION</Typography>
                <Typography variant="subttiel1" className="font-bold">Informal Negotiations</Typography>
                <Typography variant="subttiel1">Before starting arbitration, let's try to resolve any disputes informally for at least 30 days. Send written notice to initiate this process.</Typography>
                <Typography variant="subttiel1" className="font-bold">Binding Arbitration</Typography>
                <Typography variant="subttiel1">If we can't resolve things informally, we'll go to binding arbitration under the rules of the American Arbitration Association (AAA). This means you waive the right to sue in court. Arbitration can be done in person, by phone, online, or through documents. The arbitrator's decision will follow the law and can be challenged if it doesn’t. Arbitration will take place in Wilmington, Delaware. If necessary, we can use courts to enforce or challenge arbitration decisions.
                </Typography>
                <Typography variant="subttiel1" className="font-bold">Court Proceedings</Typography>
                <Typography variant="subttiel1">If a dispute goes to court, it will be handled in state or federal courts in Wilmington, Delaware. Both parties waive defenses related to jurisdiction and venue in these courts. We also exclude the application of the United Nations Convention on Contracts for the International Sale of Goods and the Uniform Computer Information Transactions Act (UCITA).
                </Typography>
                <Typography variant="subttiel1" className="font-bold">Time Limits</Typography>
                <Typography variant="subttiel1">Any dispute must be brought within one year of arising, or it’s barred. If this provision is illegal or unenforceable, the dispute will be handled in court, not arbitration, and both parties consent to jurisdiction in Delaware.</Typography>
                <Typography variant="subttiel1" className="font-bold">Restrictions</Typography>
                <Typography variant="subttiel1">Disputes are limited to the individual parties involved. No class actions or representative actions are allowed.</Typography>
                <Typography variant="subttiel1" className="font-bold">Exceptions</Typography>
                <Typography variant="subttiel1">Certain disputes related to intellectual property, allegations of theft, piracy, invasion of privacy, or unauthorized use, and claims for injunctive relief are not subject to arbitration and will be handled in court.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">CORRECTIONS</Typography>
                <Typography variant="subttiel1">We may correct any typographical errors, inaccuracies, or omissions in the Services at any time without prior notice.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">DISCLAIMER</Typography>
                <Typography variant="subttiel1">Our Services are provided "AS IS" and "AS AVAILABLE." Use at your own risk. We disclaim all warranties, express or implied, including accuracy, completeness, and non-infringement. We are not liable for any errors, omissions, or issues arising from using the Services or third-party content linked through the Services.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">LIMITATIONS OF LIABILITY</Typography>
                <Typography variant="subttiel1">We're not liable for any damages, even if we've been warned of potential damages. The most you can recover from us is what you've paid in the past six months. Certain laws may give you additional rights or limit these restrictions.
                </Typography>
                <Typography variant="h6" className="font-gilroyMedium">INDEMNIFICATION</Typography>
                <Typography variant="subttiel1">You agree to defend, indemnify, and hold us harmless from any claims, damages, or expenses arising from your use of the Services, violation of these terms, misrepresentations, or harmful conduct.
                </Typography>
                <Typography variant="h6" className="font-gilroyMedium">USER DATA
                </Typography>
                <Typography variant="subttiel1">We store certain data you provide to manage the Services. Although we back up data regularly, you're responsible for your transmitted data. We are not liable for any data loss or corruption, and you waive any claims against us regarding such issues.
                </Typography>
                <Typography variant="h6" className="font-gilroyMedium">ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</Typography>
                <Typography variant="subttiel1">Engaging with our Services electronically, such as emails and online forms, constitutes electronic communications. You consent to receive communications electronically, including agreements and notices. This includes electronic signatures for contracts and transactions, and you waive any requirements for non-electronic communications or signatures.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">CALIFORNIA USERS AND RESIDENTS</Typography>
                <Typography variant="subttiel1">California residents can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs for unresolved complaints.</Typography>
                <Typography variant="h6" className="font-gilroyMedium">MISCELLANEOUS</Typography>
                <Typography variant="subttiel1">These Legal Terms and our policies constitute the entire agreement between you and us. Failure to enforce any provision doesn't waive our rights. We may assign our rights and obligations to others. We're not liable for any issues beyond our control. If any part of these terms is unlawful, the rest remain in effect. These terms create no joint venture, partnership, employment, or agency relationship. These terms are not to be construed against us for having drafted them. You waive any defenses based on the electronic form of these terms.</Typography>
            </div>
        </div>
    );
}