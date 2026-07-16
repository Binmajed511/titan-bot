require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test the bot connection | اختبار اتصال البوت'),
        
    new SlashCommandBuilder()
        .setName('setlang')
        .setDescription('Change the bot language | تغيير لغة البوت')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Select Language / اختر اللغة')
                .setRequired(true)
                .addChoices(
                    { name: 'العربية 🇸🇦', value: 'ar' },
                    { name: 'English 🇺🇸', value: 'en' }
                ))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🔄 جاري تسجيل أوامر السلاش...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('✅ تم تسجيل الأوامر بنجاح!');
    } catch (error) {
        console.error(error);
    }
})();
