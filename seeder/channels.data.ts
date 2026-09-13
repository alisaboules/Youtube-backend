import { Channel } from '@prisma/client'
import { STORAGE_URL } from 'scripts/storage'

export const CHANNELS: Partial<Channel & { name: string }>[] = [
	{
		name: 'Nicktoons',
		slug: 'nicktoons',
		description:
			"<p>Welcome to Nicktoons, an animation destination where it's all cartoons all the time!</p><p>Nicktoons is the home for all of Nickelodeon's new and fan-favorite animated shows, such as SpongeBob SquarePants, The Loud House, The Casagrandes, The Fairly OddParents, Teenage Mutant Ninja Turtles, The Smurfs, and more! We’re serving up marathon-style compilations and full episodes that will satisfy your craving for iconic Nick animation and the funniest moments from the latest episodes of your favorite shows. Spend time with your favorite characters such as Patrick Star, Sandy Cheeks, Lincoln Loud, Smurfette, Timmy Turner, and more! Plus, we’re giving viewers a first look at an entirely new generation of Nicktoons!</p><p>►► Subscribe for new videos every week! <a href='https://at.nick.com/NicktoonsSubscribe' target='_blank'>https://at.nick.com/NicktoonsSubscribe</a></p><p>►► Watch more Nicktoons! <a href='https://at.nick.com/NicktoonsYouTube' target='_blank'>https://at.nick.com/NicktoonsYouTube</a></p><p>►► Privacy Policy: <a href='https://privacy.paramount.com/en/childrens-short' target='_blank'>https://privacy.paramount.com/en/childrens-short</a></p>",
		avatarUrl: `${STORAGE_URL}/avatars/nicktoons.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/nicktoons.jpg`,
		isVerified: true
	},
	{
		name: 'Grandalmillia',
		slug: 'grandalmillia',
		description:
			'<p>Здесь живет музыка, которая звучит в твоей голове. 🎶</p><p>Мы собрали самые яркие видеоработы последних лет: от клипов с многомиллионной армией фанатов до проникновенных песен под гитару. Вас ждет полный спектр эмоций — от безумного драйва «Сумасшедшей» до меланхолии «STAY» и глубокой веры в «Славь».</p><p>Канал создан для тех, кто ищет вдохновение и крутые треки в одном месте.</p><p>Подписывайся, чтобы сделать свою ленту немного музыкальнее! 🎧</p>',
		avatarUrl: `${STORAGE_URL}/avatars/grandalmillia.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/grandalmillia.jpg`,
		isVerified: true
	},
	{
		name: 'Nebo',
		slug: 'nebo',
		description: '<p>Лучшие зарубежные и русские клипы. Популярная музыка, свежие треки и проверенные временем видео. Качественный контент для вашего настроения. Подписывайтесь!❤️☁️</p>',
		avatarUrl: `${STORAGE_URL}/avatars/nebo.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/nebo.jpg`
	},
	{
		name: 'Toxxed',
		slug: 'toxxed',
		description:
			'<p>TOXXED — тут оживают мемы и музыка. 🎨</p><p>Мы создаём анимацию, которая цепляет: от фанатских клипов на Lemon Demon до психоделичных лирик-видео для Mindless Self Indulgence. Здесь каждый кадр дышит интернет-эстетикой и безумной энергией.</p><p>На канале ты найдёшь:<br>• 2D-анимацию в лучших традициях фан-арта<br>• Озвучки и мемы с уникальным юмором<br>• Треки, которые хочется пересматривать снова и снова</p><p>Если ты любишь творчество без рамок — ты попал куда надо. Подписывайся, чтобы не пропустить новые работы! 🔥</p>',
		avatarUrl: `${STORAGE_URL}/avatars/toxxed.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/toxxed.jpg`
	},
	{
		name: 'Zarak',
		slug: 'zarak',
		description:
			'<p>ZARAK — музыка без напряжения🖤</p><p>Фонк с душой: грувовые биты, джазовые нотки и лёгкая ностальгия по старым плёнкам. Идеально подходит для вечернего релакса, прогулок под луной или просто чтобы отключить голову.</p><p>В плейлистах — Baker Ya Maker, Devilish Trio и их лучшие треки. Никакого шума, только ритм.</p><p>Расслабься и качай. Подпишись на волну.</p>',
		avatarUrl: `${STORAGE_URL}/avatars/zarak.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/zarak.jpg`,
	},
	{
		name: 'Zhabka',
		slug: 'zhabka',
		description: '<p>ZHABKA — не просто жабка, а целая атмосфера🐸✨</p><p>Это атмосферные замедленные версии, неоновая эстетика и тикток-тренды. Здесь правят slowed reverb, уверенность и визуальный кайф.</p><p>Квакай в такт и подписывайся! 🔥</p>',
		avatarUrl: `${STORAGE_URL}/avatars/zhabka.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/zhabka.jpg`
	},
	{
		name: 'Shake Music',
		slug: 'shakemusic',
		description: '',
		avatarUrl: `${STORAGE_URL}/avatars/shake.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/shake.jpg`,
	},
	{
		name: 'Maisy Leigh',
		slug: 'maisyleigh',
		description:
			'Hi! I`m Maisy! Bringing cozy creations to life, finding my zen, and sharing my cozy lifestyle :)',
		avatarUrl: `${STORAGE_URL}/avatars/cozya.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/cozy.jpg`,
	},
	{
		name: 'KURUCHBRO',
		slug: 'kuruchbro',
		avatarUrl: `${STORAGE_URL}/avatars/kuruch.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/kuruchb.jpg`
	},
	{
		name: 'SpawnPoiint',
		slug: 'spawnpoiint',
		description:
			'SpawnPoiint: Weekly videos about Tech, Gaming and Setups! Bringing you high quality and aesthetically pleasing content from the UK. Reviewing the latest smart home tech, PlayStation, Xbox, TV Setups, Desk Setups, Apple, Gaming and more. Everything you see is recorded on an iPhone.',
		avatarUrl: `${STORAGE_URL}/avatars/spawn.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/spawnb.jpg`,
	},
	{
		name: 'John Summit',
		slug: 'johnsummit',
		description: 'forever trying to find comfort in chaos..',
		avatarUrl: `${STORAGE_URL}/avatars/john.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/johnb.jpg`,
	},
	{
		name: 'VISUALDON',
		slug: 'visualdon',
		description: '3D Visual Artist. I make Retro & Space visuals.',
		avatarUrl: `${STORAGE_URL}/avatars/visual.jpg`,
		bannerUrl: `${STORAGE_URL}/banners/visualb.jpg`,
	},
]
