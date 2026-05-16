/**
 * Seed script to populate Firestore with data from the Excel spreadsheet
 * Run with: node scripts/seed-data.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWQz4GKTvRct_HZP0nSwx2iAn5cc0913c",
  authDomain: "my-living-hope.firebaseapp.com",
  projectId: "my-living-hope",
  storageBucket: "my-living-hope.firebasestorage.app",
  messagingSenderId: "863624362085",
  appId: "1:863624362085:web:7b6cdaec7f3533619a6e8c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============ DATA FROM EXCEL SPREADSHEET ============

const products = [
  { name: "Prayer Cards Vol. 1", type: "Prayer Cards", status: "In stock", orderCost: null, salePrice: null, notes: "" },
  { name: "My Living Hope Hoodie XL", type: "Merch", status: "Temporarily unavailable", orderCost: null, salePrice: null, notes: "" },
  { name: "Kairos Cards Vol. 1", type: "Kairos Cards", status: "Re-purchase needed", orderCost: null, salePrice: null, notes: "" },
  { name: "He Mahuri Tortura Series by James Beck", type: "Digital Content", status: "Brainstormed", orderCost: null, salePrice: null, notes: "" },
  { name: "Car Bumper Stickers", type: "Product", status: "Brainstormed", orderCost: null, salePrice: null, notes: "" },
  { name: "Water bottle stickers", type: "Product", status: "Brainstormed", orderCost: null, salePrice: null, notes: "" },
  { name: "Phone cases", type: "Product", status: "Brainstormed", orderCost: null, salePrice: null, notes: "" },
  { name: "Mugs", type: "Product", status: "Brainstormed", orderCost: null, salePrice: null, notes: "" },
  { name: "Fridge Magnet", type: "Product", status: "Brainstormed", orderCost: null, salePrice: null, notes: "" },
  { name: "Notebooks", type: "Product", status: "Brainstormed", orderCost: null, salePrice: null, notes: "" },
];

const tasks = [
  { title: "Confirm Logo", details: "Confirm lantern combination etc", assignedTo: ["Jesse&Joel"], status: "Complete", urgency: "A - Complete", notes: "" },
  { title: "Create Instagram and social media base", details: "", assignedTo: ["Jesse M"], status: "Complete", urgency: "A - Complete", notes: "" },
  { title: "Product Images for Website/ Social Media", details: "Need to do photo shoot for current set of cards. This gives us something to work with for marketing", assignedTo: ["Jesse&Joel"], status: "Complete", urgency: "A - Complete", notes: "" },
  { title: "Inquire with China re: costs for print on demand", details: "", assignedTo: ["Jesse M"], status: "Complete", urgency: "A - Complete", notes: "" },
  { title: "Style Guide", details: "Confirm starting colour pallette and create overview document", assignedTo: ["Joel T"], status: "Complete", urgency: "A - Complete", notes: "" },
  { title: "Develop V2 of Prayer Cards Vol. 1", details: "", assignedTo: ["Jesse&Joel"], status: "Complete", urgency: "B - Urgent", notes: "" },
  { title: "Research distribution centers", details: "If POD is too expensive, maybe bulk buy can go to a center who processes orders for us", assignedTo: ["Jesse M"], status: "In Progress", urgency: "C - Semi Urgent", notes: "" },
  { title: "Complete Kairos Cards", details: "Hopefully done by christmas", assignedTo: ["Jesse M"], status: "In Progress", urgency: "D - Non Urgent", notes: "" },
  { title: "Email out to churches", details: "", assignedTo: ["Jesse&Joel"], status: "In Progress", urgency: "B - Urgent", notes: "" },
  { title: "Find a POD company to supply extra products", details: "More christian merch", assignedTo: ["Jesse M"], status: "In Progress", urgency: "C - Semi Urgent", notes: "" },
];

const campaigns = [
  { content: "Vol 2. is 2 weeks away", type: "Email", details: "", oversight: "Jesse M", status: "Published", notes: "" },
  { content: "How to use the colour cards", type: "Instagram/TikTok", details: "", oversight: "Joel T", status: "In progress", notes: "" },
  { content: "What does Kairos mean?", type: "Email, Instagram/TikTok", details: "", oversight: "Jesse M", status: "Paused", notes: "" },
  { content: "Jesse's reflection on justice", type: "Blog post", details: "", oversight: "Jesse M", status: "New", notes: "" },
];

const artists = [
  { name: "", email: "", phone: "", church: "", assignedDesign: "Happy Hippo", status: "Waiting on Design", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Disgraced Frog", status: "Design Received", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Anxious Mouse", status: "To Contact", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Confused Parrot", status: "Waiting on confirmation", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Gloomy Goat", status: "Archived", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Overwhelmed Monkey", status: "To Contact", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Jealous Cat", status: "To Contact", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Rejected Lion", status: "To Contact", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Unmotivated Sloth", status: "To Contact", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Disappointed Dog", status: "To Contact", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Scared Elephant", status: "To Contact", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Lonely Pig", status: "To Contact", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Stressed Bear", status: "To Contact", notes: "" },
  { name: "", email: "", phone: "", church: "", assignedDesign: "Guilty Koala", status: "To Contact", notes: "" },
];

const emotions = [
  { name: "Anxious", type: "emotion", prayerPrompt1: "Dear Lord, I am being weighed down by these things…. Please take them off my chest…", prayerPrompt2: "Dear Lord, I need your peace in these areas of my life….", verses: ["1 Peter 5:7", "Philippians 4:6", "Matthew 6:25", "Psalm 94:19"] },
  { name: "Conflicted", type: "emotion", prayerPrompt1: "Dear Lord, I am conflicted about... I need your wisdom and insight…", prayerPrompt2: "Dear Lord, my heart says one thing and my mind says another. Please show me what you say about this situation....", verses: ["Proverbs 3:5-6", "James 1:5", "1 Peter 5:7"] },
  { name: "Powerless", type: "emotion", prayerPrompt1: "Dear Lord, these situations in my life.... leave me feeling powerless and out of control. I really need you to...", prayerPrompt2: "Dear Lord, it's hard to trust you at the moment. Please increase my faith…", verses: ["Isaiah 41:10", "2 Corinthians 12:9-10", "Psalm 121"] },
  { name: "Overwhelmed", type: "emotion", prayerPrompt1: "Dear Lord, these things are freaking me out... Please help me rest in you…", prayerPrompt2: "Dear Lord, when I try and work things out in my head I get overwhelmed and freak out. Please help me trust in you…", verses: ["Matthew 19:26", "Matthew 11:28", "Psalm 142:3", "Psalm 55:22"] },
  { name: "Inadequate", type: "emotion", prayerPrompt1: "Dear Lord, I don't feel like I'm able to deal with these things in my life...", prayerPrompt2: "Dear Lord, I feel inadequate, please give me strength and wisdom", verses: ["Philippians 4:13", "Hebrews 12:14-15"] },
  { name: "Relieved", type: "emotion", prayerPrompt1: "Dear Lord, thank you for getting me through this storm once again. You have eased my burden…", prayerPrompt2: "Dear Lord, I feel relieved because...", verses: ["Psalm 107:1", "Colossians 2:6-7", "1 Thessalonians 5:16-18"] },
  { name: "Bitter", type: "emotion", prayerPrompt1: "Dear Lord, I don't want to remain bitter. Show me how I can love and forgive others…", prayerPrompt2: "Dear Lord, I forgive…. for whatever they have done to make me bitter…", verses: ["Ephesians 4:31-33", "Hebrews 12:14-15"] },
  { name: "Impatient", type: "emotion", prayerPrompt1: "Dear Lord, waiting is hard. Please give me patience with these things...", prayerPrompt2: "Dear Lord, teach me to be wise and know that you will work things out in your time…", verses: ["Romans 12:12", "Psalm 37:1-7", "Galatians 6:9"] },
  { name: "Angry", type: "emotion", prayerPrompt1: "Dear Lord, I don't make great decisions when I'm angry. Show me how I can find peace…", prayerPrompt2: "Dear Lord, I am angry at….. please be with me…", verses: ["Ephesians 4:26", "Proverbs 14:29", "James 1:19-20"] },
  { name: "Rejected", type: "emotion", prayerPrompt1: "Dear Lord, I feel rejected by some people. Thank you that you will always love me no matter what…", prayerPrompt2: "Dear Lord, I feel rejected because.... I need you…", verses: ["Psalm 27:10", "2 Corinthians 12:9", "Isaiah 49:15"] },
  { name: "Joyful", type: "emotion", prayerPrompt1: "Dear Lord, thank you for....", prayerPrompt2: "Dear Lord, I am joyful because…. It feels great!…", verses: ["Psalms 16:11", "Romans 12:12", "1 Thessalonians 5:16"] },
  { name: "Insecure", type: "emotion", prayerPrompt1: "Dear Lord, I've been feeling insecure, it's not nice at all. Please show me your love that reminds me of my identity", prayerPrompt2: "Dear Lord, I feel insecure because.... Please show me how you see me!", verses: ["2 Timothy 1:7", "Psalm 139", "Ephesians 2:10"] },
  { name: "Confused", type: "emotion", prayerPrompt1: "Dear Lord, I am really confused about…. Please give me some clarity…", prayerPrompt2: "Dear Lord, I don't know where to go or what to do, please give me direction with…", verses: ["2 Timothy 2:7", "Matthew 7:7", "James 1:5"] },
  { name: "Unmotivated", type: "emotion", prayerPrompt1: "Dear Lord, It feels like I've been going through life without purpose or motivation. Please help me set my heart on what can inspire me…", prayerPrompt2: "Dear Lord, I don't know where to go or what to do, please give me direction with…", verses: ["Galatians 6:9", "Jeremiah 29:11", "Philippians 4:13"] },
  { name: "Upset", type: "emotion", prayerPrompt1: "Dear Lord, I'm feeling upset about….", prayerPrompt2: "Dear Lord, I really need you to….", verses: ["Luke 10:41", "Psalm 55", "Psalm 107:13"] },
  { name: "Hurt", type: "emotion", prayerPrompt1: "Dear Lord, I'm hurt because of...", prayerPrompt2: "Dear Lord, I'm hurting and it sucks. Please heal my heart", verses: ["Psalm 34:18", "Luke 6:28", "2 Corinthians 1:4"] },
  { name: "Grateful", type: "emotion", prayerPrompt1: "Dear Lord, I am thankful for….", prayerPrompt2: "Dear Lord, I praise you for what you have done for me…", verses: ["Luke 17:15", "1 Thessalonians 5:16", "Psalm 100:5"] },
  { name: "Calm", type: "emotion", prayerPrompt1: "Dear Lord, thank you for this feeling, I pray….", prayerPrompt2: "Dear Lord, thank you for calming these storms in my life….", verses: ["John 14:27", "Psalm 23:2", "Philippians 4:6"] },
  { name: "Disappointed", type: "emotion", prayerPrompt1: "Dear Lord, I am very disappointed about…. please be with me…", prayerPrompt2: "Dear Lord, it seems like there's no hope, please give me your never failing hope…", verses: ["Psalm 34:18", "Psalm 9:18", "Romans 8:28", "Romans 5:1"] },
  { name: "Jealous", type: "emotion", prayerPrompt1: "Dear Lord, I am feeling jealous or bitter. Show me your mercy that I may have mercy on others…", prayerPrompt2: "Dear Lord, my relationships are being affected by jealousy, I pray into these…", verses: ["Proverbs 14:30", "Philippians 2:3", "James 3:13-18"] },
  { name: "Trapped", type: "emotion", prayerPrompt1: "Dear Lord, I feel trapped because…. I need your guidance…", prayerPrompt2: "Dear Lord, I feel trapped, stuck, and confused, please show me the way to go…", verses: ["Psalm 91", "John 8:36", "Romans 8"] },
  { name: "Scared", type: "emotion", prayerPrompt1: "Dear Lord, I am scared of…. Please give me your peace…", prayerPrompt2: "Dear Lord, I don't know if I can get through this…. Please give me your courage…", verses: ["Joshua 1:9", "Isaiah 41:10", "John 14:27"] },
  { name: "Stressed", type: "emotion", prayerPrompt1: "Dear Lord, these things…. have been running around in my head. Please give me peace…", prayerPrompt2: "Dear Lord, I am stressed out because…. Thank you for your promise that you have it all in your hands…", verses: ["Proverbs 16:3", "Psalm 4:11", "1 Peter 5:7"] },
  { name: "Guilty", type: "emotion", prayerPrompt1: "Dear Lord, I feel guilty because… I ask for forgiveness, thank you that I am now forgiven…", prayerPrompt2: "Dear Lord, you do not want me to live in guilt so I hand these things over to you...", verses: ["Psalm 51:1", "1 John 1:7", "Romans 8:1"] },
  { name: "Lonely", type: "emotion", prayerPrompt1: "Dear Lord, I feel lonely because... I need you to reveal yourself in my life…", prayerPrompt2: "Dear Lord, I would like someone to talk to, please show me who I can reach out to…", verses: ["Psalm 23", "Psalm 25:16", "Psalm 34:18"] },
  { name: "Shameful", type: "emotion", prayerPrompt1: "Dear Lord, I feel a bit shameful about some things. I don't think I can be loved. Thank you for loving me anyway…", prayerPrompt2: "Dear Lord, I feel shameful. I confess.… Thank you that you love me and that Jesus has paid the price for my guilt and shame…", verses: ["Romans 10:11", "2 Corinthians 5:17", "1 John 1:9", "Psalm 25"] },
  { name: "Happy", type: "emotion", prayerPrompt1: "Dear Lord, thank you! Thank you for…", prayerPrompt2: "Dear Lord, it's great to be happy. Show me someone who I can share my happiness with…", verses: ["Psalm 37:4", "Philippians 4:4", "1 Thessalonians 5:16-18"] },
  { name: "Worried", type: "emotion", prayerPrompt1: "Dear Lord, I am worried about…. Help me to stop overthinking about it…", prayerPrompt2: "Dear Lord, when so many things are worrying me would you please be my peace…", verses: ["Psalm 55:22", "Matthew 6:25-34", "Philippians 4:6-7"] },
  { name: "Peaceful", type: "emotion", prayerPrompt1: "Dear Lord, I praise you for this feeling of peace. I want to continue to seek you.", prayerPrompt2: "Dear Lord, Thank you for.... Please hold me tight", verses: ["John 14:27", "Isaiah 26:3", "Psalm 94:19"] },
  { name: "Weary", type: "emotion", prayerPrompt1: "Dear Lord, I am exhausted and worn out because... I come to you to find rest", prayerPrompt2: "Dear Lord, it's been a long, hard season of life for me. Please be my rock of refuge", verses: ["Isaiah 40:29-31", "Matthew 11:28-30", "Psalm 73:26"] },
  // Desires
  { name: "Friendship", type: "desire", prayerPrompt1: "Dear Lord, I need some friendships in my life because… Thank you for hearing my prayer…", prayerPrompt2: "Dear Lord, in a time when I feel lonely, please be near to me as a friend.", verses: ["Proverbs 27:17", "John 5:13", "Proverbs 17:17"] },
  { name: "Affection", type: "desire", prayerPrompt1: "Dear Lord, right now I need a bit of love and affection in my life. Would you please place your love on my heart.", prayerPrompt2: "Dear Lord, it's so easy to try and get affection from other places. I want to experience love from you.", verses: ["Romans 12:10", "2 Peter 1:4-6"] },
  { name: "Joy", type: "desire", prayerPrompt1: "Dear Lord, right now I need a bit of joy and excitement in my life. Would you please give me your joy…", prayerPrompt2: "Dear Lord, I'm not feeling so joyful because....", verses: ["Philippians 4:4", "Psalm 16:11", "John 16:24"] },
  { name: "Solitude", type: "desire", prayerPrompt1: "Dear Lord, I would like some time alone to spend with myself and you. Please help me to find a place for this…", prayerPrompt2: "", verses: ["Luke 5:16", "Psalm 27"] },
  { name: "Support", type: "desire", prayerPrompt1: "Dear Lord, I am struggling with some things in my life... Please give me someone to share these things with and the courage to share…", prayerPrompt2: "", verses: ["Psalm 55:22", "1 Thessalonians 5:11", "2 Corinthians 1:3-4"] },
  { name: "Forgiveness", type: "desire", prayerPrompt1: "Dear Lord, I feel…. because…. I need you to remind me how much I am forgiven by you…", prayerPrompt2: "", verses: ["Psalm 51", "Colossians 3:12-15", "1 John 1:9"] },
  { name: "Love", type: "desire", prayerPrompt1: "Dear Lord, I would like to experience some more love in my life. Please guide me to where I can find this…", prayerPrompt2: "Dear Lord, there is a hole in my heart that only you can fill. I come to you now asking to be filled.", verses: ["John 3:16", "Romans 8:38-40", "Psalm 139:14"] },
  { name: "Freedom", type: "desire", prayerPrompt1: "Dear Lord, I'm feeling trapped in some areas of life. Please help me find freedom…", prayerPrompt2: "Dear Lord, you alone bring me true freedom, help me to discover more of that.", verses: ["John 8:16", "John 10:10", "2 Corinthians 5:17"] },
  { name: "Adventure", type: "desire", prayerPrompt1: "Dear Lord, I'm feeling a bit stagnant, please give me an adventure to get stuck into…", prayerPrompt2: "", verses: ["Isaiah 40:31", "John 10:10", "Psalm 16:11"] },
  { name: "Trust", type: "desire", prayerPrompt1: "Dear Lord, sometimes it is hard to find people to trust. Help me to trust you and be wise with trusting others…", prayerPrompt2: "", verses: ["Proverbs 3:5-6", "Philippians 4:6", "Luke 16:10"] },
  { name: "Affirmation", type: "desire", prayerPrompt1: "Dear Lord, I feel uncertain about myself and my self-esteem is low because... I would like you to show me how to place my identity in you…", prayerPrompt2: "", verses: ["Matthew 3:16-17", "John 14:15-21"] },
  { name: "Self-assurance", type: "desire", prayerPrompt1: "Dear Lord, I feel uncertain about myself and my self-esteem is low because... I would like you to show me how to place my identity in you…", prayerPrompt2: "Dear Lord, I struggle to trust myself or believe in myself. Please show me the way you see me…", verses: ["Matthew 3:16-17", "John 14:15-21", "Psalm 139"] },
  { name: "Acceptance", type: "desire", prayerPrompt1: "Dear Lord, I don't feel accepted right now because... I pray I would know that your acceptance and love are enough…", prayerPrompt2: "", verses: ["Ephesians 1:6-14", "Romans 8:1-17"] },
  { name: "To Be Heard", type: "desire", prayerPrompt1: "Dear Lord, I want my voice to be heard. Thank you that you listen and care deeply about who I am and what I think/say…", prayerPrompt2: "", verses: ["Psalm 28:6", "Psalm 69:33", "1 John 5:14"] },
  { name: "Patience", type: "desire", prayerPrompt1: "Dear Lord, I am struggling to find patience with…. Please give me patience…", prayerPrompt2: "", verses: ["Psalm 27:14", "Isaiah 40:31", "James 1:5-18"] },
  { name: "Hope", type: "desire", prayerPrompt1: "Dear Lord, I am feeling a bit hopeless about…. Please bring hope back into this place…", prayerPrompt2: "Dear Lord, show me what it means to place my hope in Jesus, a living hope.", verses: ["Jeremiah 29:11", "Romans 5:1-5", "Hebrews 11:1", "Psalm 31:19"] },
  { name: "Stability", type: "desire", prayerPrompt1: "Dear Lord, my life feels all over the place at the moment. Please be my rock and give me some stability", prayerPrompt2: "Dear Lord, I feel.... I praise you for being my rock of refuge", verses: ["Isaiah 33:6", "Psalm 62", "Psalm 16:8"] },
  { name: "Purpose", type: "desire", prayerPrompt1: "Dear Lord, my life feels meaningless at times. Please show me my purpose for my being and my doing", prayerPrompt2: "Dear Lord, I need purpose in these areas... Please renew my life", verses: ["Jeremiah 29:11", "Ephesians 2:10", "Isaiah 30:21"] },
  { name: "Direction", type: "desire", prayerPrompt1: "Dear Lord, Please show me the way to go in this situation....", prayerPrompt2: "Dear Lord, I feel a bit lost, I want to turn to you because you are the way, the truth and the life.", verses: ["Psalm 37", "James 1:5", "Isaiah 30:21"] },
  { name: "Growth", type: "desire", prayerPrompt1: "Dear Lord, I'm eager to grow in this area of life... I come to you", prayerPrompt2: "Dear Lord, I long to become more like you. Please grow me into the person you created me to be", verses: ["Titus 2:11-14", "John 15", "Galatians 5:22-23"] },
];

const brainstormIdeas = [
  { submittedBy: "Joel T", idea: "Logo needs a monochrome design to be more applicable across products", details: "", pros: "", cons: "", status: "Actioned", actions: "" },
  { submittedBy: "Joel T", idea: "Split the current pack into a main pack and an expansion", details: "Vol 1. is Emotions/Desires and Vol 2. is Colours & Characters. This means Vol. 1 can have a distinct two colour palette design and not be cluttered by Vol. 2s multicoloured variety.", pros: "Great to have 2 volumes on launch. Unique styles but the same goal, easy to use together or separately. Could be good for helping with age demographic too eg. younger kids might prefer to use colours and characters, but they're accessible for anyone", cons: "Cost for the consumer may be something we want to explore - at what point is it getting too expensive for say a young person who wants to have all the cards", status: "Actioned", actions: "" },
  { submittedBy: "Joel T", idea: "Content on the back side needs to be portrait", details: "Full title of emotion/need can be landscape, then flip on the back to see everything in a nice portrait design", pros: "Will be easier to read, more comfortable to hold in the hand for longer", cons: "Potentially claustrophobic, will experiment to see what works", status: "Actioned", actions: "" },
  { submittedBy: "Jesse M", idea: "Connecting products with Mana, Christian Superstore", details: "", pros: "Excellent target market", cons: "Additional management, they'll take a cut of the sales etc.", status: "Noted", actions: "" },
  { submittedBy: "Jesse M", idea: "Inviting other creatives to sell products in line with our values on the My Living Hope store", details: "Currently producing Kairos Cards. Will need Joels input for design", pros: "Give more people the chance to go deeper with Jesus in different ways", cons: "", status: "Actioned", actions: "" },
  { submittedBy: "Jesse M", idea: "Eastercamp promotions, giveaways etc.", details: "Maybe a stall?", pros: "", cons: "", status: "Noted", actions: "" },
  { submittedBy: "Joel T", idea: "Artists donate designs for the products", details: "Ask artists from various church backgrounds to provide artwork for one card. Credit them on the flip side with their instagram handle attached. Free image for us, free exposure for them.", pros: "Will result in a vast array of awesome designs of characters/artwork. Great community building. Can shout them all out on the website etc.", cons: "", status: "Noted", actions: "" },
  { submittedBy: "Joel T", idea: "Prayer Cards expansion - Landscapes", details: "A collection of artwork that showcases a variety of beautiful landscapes, all created by different kiwi artists and all designed to invite certain emotions, thoughts and ideas", pros: "", cons: "Would be a hefty job to recruit artists", status: "Noted", actions: "" },
  { submittedBy: "Joel T", idea: "Prayer Cards expansion - Emojis", details: "An accessible collection of cards for a young generation who speak in the language of emojis", pros: "Some great options out there for free to use icons eg. https://www.thiings.co/things", cons: "Would it be wiser to create art ourselves for something like this given most free to use content is likely ai or lower quality", status: "Noted", actions: "" },
  { submittedBy: "Joel T", idea: "Could make a page here for tracking ideas for cards", details: "", pros: "", cons: "", status: "Noted", actions: "" },
  { submittedBy: "Jesse M", idea: "Connections with people in Aus and America", details: "Platform to create international market.", pros: "Americans love these sort of things!", cons: "Load management increases", status: "Noted", actions: "" },
  { submittedBy: "Jesse M", idea: "Link with E Tu Tangata", details: "Love what they're about. would be cool to cooperate", pros: "", cons: "", status: "Noted", actions: "" },
  { submittedBy: "Jesse M", idea: "Workplace items - posters, stickers etc.", details: "", pros: "", cons: "", status: "Noted", actions: "" },
  { submittedBy: "Jesse M", idea: "Connect shopify with POD company", details: "Sell Phone cases. Stickers for cars, laptops, water bottles. Notebooks. Mugs. Fridge magnets", pros: "", cons: "", status: "Noted", actions: "" },
];

const businessChecklist = [
  { category: "Business Structure", task: "Choose structure", details: "Decide between Sole Trader (simpler) or Limited Company (more protection)", link: "https://www.business.govt.nz/getting-started/choosing-the-right-business-structure/", completed: false },
  { category: "Business Name", task: "Check availability", details: "Search OneCheck for name, domain, and trademark conflicts", link: "https://www.business.govt.nz/onecheck/", completed: false },
  { category: "Business Name", task: "Register business name", details: "Sole traders can trade under chosen name; companies must register", link: "https://companies-register.companiesoffice.govt.nz/", completed: false },
  { category: "NZBN", task: "Get NZ Business Number", details: "Apply for a free NZBN to use on invoices and forms", link: "https://www.nzbn.govt.nz/", completed: false },
  { category: "IRD", task: "Get IRD number", details: "Use your personal IRD if sole trader or register company IRD if incorporated", link: "https://www.ird.govt.nz/", completed: false },
  { category: "Tax", task: "Register for GST", details: "Required if turnover > $60,000 per year or if you want to claim GST", link: "https://www.ird.govt.nz/gst", completed: false },
  { category: "Banking", task: "Open business bank account", details: "Keep business and personal finances separate for clarity", link: "", completed: false },
  { category: "Accounting", task: "Set up accounting software", details: "Use Xero, Hnry, or Wave to manage invoices, expenses, and tax", link: "https://www.xero.com/nz/", completed: false },
  { category: "Intellectual Property", task: "Protect your brand", details: "Trademark game name and logo through IPONZ", link: "https://www.iponz.govt.nz/", completed: false },
  { category: "Intellectual Property", task: "Copyright your product", details: "Copyright is automatic, but keep dated records of all work", link: "", completed: false },
  { category: "Contracts", task: "Create contractor agreements", details: "Clearly define deliverables, payment, IP ownership, confidentiality", link: "https://www.business.govt.nz/", completed: false },
  { category: "Product Compliance", task: "Review packaging laws", details: "Ensure packaging complies with Fair Trading Act and safety info", link: "https://www.consumerprotection.govt.nz/", completed: false },
  { category: "Product Compliance", task: "Add origin and manufacturer details", details: "Include NZ contact or origin info on packaging", link: "", completed: false },
  { category: "Sales", task: "Set up online store", details: "Build store via Shopify, Squarespace, or WooCommerce", link: "https://www.shopify.co.nz/", completed: false },
  { category: "Sales", task: "In-person sales setup", details: "Get EFTPOS/Square reader for markets or pop-ups", link: "https://squareup.com/nz/en", completed: false },
  { category: "Sales", task: "Create wholesale offer", details: "Design a wholesale price sheet and barcode if needed", link: "https://www.gs1nz.org/", completed: false },
  { category: "Manufacturing", task: "Choose manufacturer", details: "Pick local (e.g. NZ Print) or overseas (PandaGM, LongPack)", link: "", completed: false },
  { category: "Logistics", task: "Plan storage and shipping", details: "Decide on home storage, NZ Post eShip, or fulfilment centre", link: "https://www.nzpost.co.nz/business/eshop", completed: false },
  { category: "Insurance", task: "Get business insurance", details: "Public and product liability, contents insurance", link: "https://www.bizcover.co.nz/", completed: false },
  { category: "Marketing", task: "Secure domain name", details: "Buy .nz domain and set up basic website", link: "https://www.registerdirect.co.nz/", completed: false },
  { category: "Marketing", task: "Create social media profiles", details: "Set up Instagram, TikTok, YouTube for game promotion", link: "", completed: false },
  { category: "Marketing", task: "Follow Fair Trading Act", details: "Ensure all marketing claims are accurate and not misleading", link: "https://comcom.govt.nz/", completed: false },
  { category: "Record Keeping", task: "Keep records for 7 years", details: "Keep digital and paper records of income/expenses", link: "", completed: false },
  { category: "Tax", task: "Save money for tax", details: "Set aside ~25-30% of profit for income tax", link: "", completed: false },
  { category: "Tax", task: "File returns", details: "File annual tax return; GST if registered every 2 or 6 months", link: "https://www.ird.govt.nz/", completed: false },
  { category: "Optional", task: "Apply for grants", details: "Look into Creative NZ or local council business grants", link: "https://creativenz.govt.nz/", completed: false },
  { category: "Optional", task: "Join local networks", details: "Connect with game dev or creative business groups in Christchurch", link: "https://www.startupchristchurch.co.nz/", completed: false },
  { category: "Optional", task: "NZ Made certification", details: "Register if producing locally for marketing advantage", link: "https://buynz.org.nz/", completed: false },
];

// ============ SEED FUNCTIONS ============

async function seedCollection(collectionName, data) {
  console.log(`Seeding ${collectionName}...`);
  const colRef = collection(db, collectionName);

  for (const item of data) {
    try {
      await addDoc(colRef, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
    }
  }

  console.log(`✓ ${collectionName}: ${data.length} documents added`);
}

async function main() {
  console.log('Starting data seed...\n');

  try {
    await seedCollection('products', products);
    await seedCollection('tasks', tasks);
    await seedCollection('campaigns', campaigns);
    await seedCollection('artists', artists);
    await seedCollection('emotions', emotions);
    await seedCollection('brainstormIdeas', brainstormIdeas);
    await seedCollection('businessChecklist', businessChecklist);

    console.log('\n✅ All data seeded successfully!');
    console.log('\nYou can now view the data at:');
    console.log('https://my-living-hope.web.app');

  } catch (error) {
    console.error('Error seeding data:', error);
  }

  process.exit(0);
}

main();
