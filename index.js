require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// ذاكرة مؤقتة لحفظ لغة كل سيرفر (الافتراضي هو العربية 'ar')
const guildLanguages = {}; 

// دالة جلب النصوص المترجمة
function t(guildId, key, variables = {}) {
    const lang = guildLanguages[guildId] || 'ar';
    const filePath = path.join(__dirname, 'locales', `${lang}.json`);
    
    try {
        if (!fs.existsSync(filePath)) return key;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(fileContent);
        let text = translations[key] || key;

        Object.keys(variables).forEach(varKey => {
            text = text.replace(new RegExp(`{${varKey}}`, 'g'), variables[varKey]);
        });

        return text;
    } catch (error) {
        console.error(`خطأ في قراءة ملف اللغة ${lang}:`, error);
        return key;
    }
}

client.once(Events.ClientReady, c => {
    console.log(`✅ Titan Bot جاهز! يعمل الآن باسم: ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const guildId = interaction.guildId;

    // أمر فحص الاتصال
    if (interaction.commandName === 'ping') {
        await interaction.reply(t(guildId, 'ping_response'));
    }

    // أمر تغيير اللغة
    if (interaction.commandName === 'setlang') {
        if (!interaction.member.permissions.has('Administrator')) {
            return await interaction.reply({ content: t(guildId, 'no_permission'), ephemeral: true });
        }

        const targetLang = interaction.options.getString('language');
        guildLanguages[guildId] = targetLang;

        await interaction.reply(t(guildId, 'bot_language_changed'));
    }
});

client.login(process.env.DISCORD_TOKEN);
