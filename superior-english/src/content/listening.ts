import type { Item } from '@/core';

/** Original listening items (audio = text-to-speech of the script). Owner: content-listening agent. */
export const listeningItems: Item[] = [
  {
    id: 'wfd-001',
    type: 'write-from-dictation',
    title: 'Assignment deadline',
    difficulty: 1,
    sentence: 'All assignments must be submitted through the online portal by Friday.',
  },
  {
    id: 'hiw-001',
    type: 'highlight-incorrect-words',
    title: 'Coral reefs',
    difficulty: 2,
    text:
      'Coral reefs cover less than [one|two] percent of the ocean floor, yet they support about a [quarter|third] of all marine species. Rising water temperatures cause corals to [expel|absorb] the algae that give them colour and energy.',
  },

  // ---------- Summarize Spoken Text (SST) ----------
  {
    id: 'sst-001',
    type: 'summarize-spoken-text',
    title: 'Rooftop hives',
    difficulty: 2,
    voice: 'female',
    script:
      'Good morning, everyone. Today I want to talk about a trend that has grown quickly in large cities: urban beekeeping. Many people assume that bees struggle in busy urban areas, but in several cities, colonies have access to a wider variety of flowers than they would on farmland. Gardens, balconies, parks and street trees bloom at different times through the year, so the bees rarely run short of pollen. The first point concerns the rules. Before installing a hive on a rooftop, a beekeeper usually needs permission from the local council, and most councils require hives to be registered and inspected once a year. Some cities also limit the number of hives in each district, to avoid crowding the same flower sources. The second point is the benefit for food production. Bees that forage in the city visit nearby vegetable plots, fruit trees and community gardens, and this pollination can increase yields. Researchers have reported larger tomato and apple harvests when hives are placed within a few kilometres of the plants. Finally, the honey itself. Urban honey tastes different from rural honey, because it reflects the mix of plants in the area. Buyers often find this surprising, and some producers now label their jars by neighbourhood. In short, urban beekeeping offers flowers, food and a useful lesson about how cities can support wildlife.',
    keyPoints: [
      { label: 'flowers and pollen', keywords: ['flower', 'pollen', 'bloom'] },
      { label: 'council rules', keywords: ['council', 'permission', 'register', 'permit'] },
      { label: 'pollination and harvests', keywords: ['pollination', 'pollinate', 'harvest', 'vegetable'] },
      { label: 'honey flavour', keywords: ['honey', 'flavour', 'taste'] },
    ],
    modelAnswer:
      'The lecture explains that urban beekeeping can succeed in cities, because gardens and parks provide a varied supply of flowers. Beekeepers need council permission and must register their hives, and some districts limit the number of hives. The bees also improve pollination of nearby vegetables and fruit, which raises harvests. Honey from the city reflects local plants, so each neighbourhood has its own flavour.',
  },
  {
    id: 'sst-002',
    type: 'summarize-spoken-text',
    title: 'Sleep and memory',
    difficulty: 2,
    script:
      "Welcome to today's session on sleep and learning. Most people know that a good night's sleep helps them feel alert, but researchers have found that sleep also plays an active role in memory. During the night, the brain replays recent experiences and decides which ones to keep. The first finding concerns timing. In one study, students who learned a list of words in the evening and then slept performed better the next morning than students who stayed awake for the same period. The benefit was strongest for material the students had found difficult. The second finding is about the stages of sleep. Deep, slow sleep seems to support the memory of facts and events, while the lighter stages that come later help with motor skills, such as playing an instrument or typing quickly. The third point is practical. Cutting sleep short, even by one or two hours, reduces the ability to form new memories. So the advice for anyone preparing for an exam is straightforward: review your notes before bed, and protect your sleep in the final week rather than cramming until dawn.",
    keyPoints: [
      { label: 'sleep supports memory', keywords: ['memory', 'memories', 'recall'] },
      { label: 'evening study', keywords: ['evening', 'night', 'before bed'] },
      { label: 'difficult material', keywords: ['difficult', 'hard'] },
      { label: 'deep sleep and facts', keywords: ['deep sleep', 'facts', 'events'] },
      { label: 'short sleep harms recall', keywords: ['short', 'shortened', 'less sleep'] },
    ],
    modelAnswer:
      'The talk explains that sleep actively supports memory rather than simply resting the brain. Students who studied in the evening and then slept remembered word lists better, especially difficult material. Deep sleep helps people retain facts and events, while lighter sleep supports motor skills. Cutting sleep short weakens new memories, so exam candidates should protect their sleep.',
  },
  {
    id: 'sst-003',
    type: 'summarize-spoken-text',
    title: 'Library lending',
    difficulty: 1,
    voice: 'male',
    script:
      'Public libraries in Canada have changed a great deal over the last twenty years. Many branches now offer far more than books. You can borrow a laptop, book a study room, join a language conversation group or learn how to use a three-dimensional printer. The first change is access to technology. Libraries provide free computers and internet access, which matters to people who cannot afford a home connection. Some branches also lend mobile hotspots for a few weeks at a time. The second change is the range of equipment. Certain libraries lend sewing machines, power drills and garden tools, so residents can try a skill before buying their own. These collections are often called tool libraries, and they reduce waste, because fewer items end up in landfill. The third change concerns the community. Libraries host job-search workshops, citizenship preparation classes and story sessions for young children. Staff often act as connectors, referring families to social services they might otherwise never find. Overall, the library has become a shared space where people learn, share and borrow, rather than simply a place to store books.',
    keyPoints: [
      { label: 'technology access', keywords: ['computer', 'internet', 'hotspot', 'technology'] },
      { label: 'lending tools', keywords: ['tool', 'equipment', 'drill', 'sewing'] },
      { label: 'less waste', keywords: ['waste', 'landfill'] },
      { label: 'community programmes', keywords: ['workshop', 'classes', 'community', 'services'] },
    ],
    modelAnswer:
      'The lecture describes how Canadian public libraries now offer much more than books. Libraries provide free computers, internet access and mobile hotspots. Some lend tools such as drills and sewing machines, which reduces waste. They also run workshops for jobs and citizenship, and refer families to social services. Libraries have become shared community spaces.',
  },
  {
    id: 'sst-004',
    type: 'summarize-spoken-text',
    title: 'Bakery supply chain',
    difficulty: 2,
    script:
      "Let me describe a case study that many small business owners will recognise. A family bakery in a mid-sized town had relied on a national supplier for flour and butter for twenty years. Last year, the owner decided to change her supply chain and buy most of her ingredients from farms within eighty kilometres. The decision had three main effects. First, the bakery's ingredient costs rose by about twelve percent, because local suppliers charge more per sack than national distributors. Second, deliveries became more reliable, since a farmer can drop off flour on the same day an order is placed. Third, the bakery's image changed. Customers began to see the shop as a local producer, and sales of bread and pastries grew steadily. The owner also discovered a hidden benefit. Because the ingredients were fresher, the bread stayed good for longer, so the shop threw away far less product at the end of each day. The main lesson is that a shorter supply chain is not automatically cheaper. It can raise costs, but it may also improve reliability, marketing and waste. Those gains can outweigh the extra expense if the business is managed carefully.",
    keyPoints: [
      { label: 'higher costs', keywords: ['cost', 'expensive', 'price'] },
      { label: 'reliable deliveries', keywords: ['deliver', 'reliable', 'reliability'] },
      { label: 'local brand and sales', keywords: ['local', 'brand', 'image', 'sales'] },
      { label: 'less waste', keywords: ['waste', 'fresher', 'fresh'] },
      { label: 'trade-off lesson', keywords: ['benefit', 'lesson', 'outweigh'] },
    ],
    modelAnswer:
      'The case study describes a bakery that switched to local ingredient suppliers. Its costs rose because local farms charge more. However, deliveries became more reliable, and customers saw the bakery as a local producer, which increased sales. Fresher ingredients also reduced daily waste. The lesson is that shorter supply chains can cost more but still bring valuable benefits.',
  },
  {
    id: 'sst-005',
    type: 'summarize-spoken-text',
    title: 'Printing and literacy',
    difficulty: 3,
    voice: 'female',
    script:
      'Today we will look at the printing press and its effect on literacy in early modern Europe. Before printing became widespread, every book was copied by hand. A single manuscript could take months to produce, so books were expensive and mostly owned by churches, universities and wealthy families. When movable type reached workshops in the middle of the fifteenth century, the cost of books fell sharply. Within a few decades, printers across the continent had produced millions of copies, and many were written in local languages rather than Latin. This allowed merchants, craftspeople and farmers to read texts that had once been out of reach. Historians debate how much printing alone caused higher literacy. Schools, the spread of religious reform and growing trade all played a part. However, most agree that printing made reading material far more common, and that it encouraged people to read silently and privately, rather than only hearing texts read aloud. The long-term consequence was a change in how knowledge was shared. Ideas could travel further and faster, and the reading public became an audience that could compare, criticise and debate what it read.',
    keyPoints: [
      { label: 'cheaper books', keywords: ['cheap', 'cheaper', 'cost', 'expensive'] },
      { label: 'local languages', keywords: ['language', 'local', 'vernacular'] },
      { label: 'more readers', keywords: ['literacy', 'read', 'reader', 'reading'] },
      { label: 'other factors', keywords: ['school', 'trade', 'reform'] },
      { label: 'faster sharing of ideas', keywords: ['idea', 'faster', 'spread', 'debate'] },
    ],
    modelAnswer:
      'The lecture explains that the printing press made books far cheaper than hand-copied manuscripts. Printers produced large numbers of books, often in local languages, so more ordinary people could read. Historians note that schools and trade also mattered, but printing encouraged private reading. Ideas spread faster, and readers began to compare and debate what they read.',
  },
  {
    id: 'sst-006',
    type: 'summarize-spoken-text',
    title: 'Jazz improvisation',
    difficulty: 3,
    script:
      'Welcome to this introduction to jazz improvisation. Many listeners assume that jazz players invent their solos entirely on the spot, but the reality is more structured. Improvisation is built on a shared framework, and learning it takes years of listening and practice. The first element is the chord progression. Most jazz standards follow a repeating sequence of chords, and each soloist chooses notes that fit the harmony at that moment. A player who understands the harmony can make unexpected choices and still sound coherent. The second element is rhythm. Jazz musicians often play slightly behind or ahead of the beat, which gives the music its swing. Improvisers practise by tapping along with recordings until the feel becomes natural. The third element is listening. Good improvisers respond to what other band members play, repeating a phrase, changing its direction or leaving space. In this sense, a solo is a dialogue rather than a monologue. To begin, students are usually asked to learn a simple blues, transcribe a short solo by a famous player and then play along with a backing track.',
    keyPoints: [
      { label: 'structure', keywords: ['structure', 'framework', 'progression'] },
      { label: 'chords and harmony', keywords: ['chord', 'harmony'] },
      { label: 'rhythm and swing', keywords: ['rhythm', 'swing', 'beat'] },
      { label: 'listening', keywords: ['listen', 'respond'] },
      { label: 'practice methods', keywords: ['practise', 'practice', 'transcribe', 'backing track'] },
    ],
    modelAnswer:
      'The lecture explains that jazz improvisation has a clear structure. Players build solos over repeating chord progressions and choose notes that fit the harmony. Playing slightly behind or ahead of the beat creates swing. Good improvisers also listen closely and respond to other musicians. Students learn by transcribing solos and playing along with backing tracks.',
  },

  // ---------- Listening: Multiple Choice, Multiple Answers (LMCM) ----------
  {
    id: 'lmcm-001',
    type: 'listening-mcma',
    title: 'Library exam hours',
    difficulty: 1,
    voice: 'female',
    script:
      'Attention all students. The university library will change its opening hours for the examination period, starting on Monday the fourteenth of December. From that date, the main library will open at seven in the morning and stay open until midnight on weekdays. On Saturdays and Sundays, it will close at nine in the evening instead of six. The quiet study rooms on the third floor can now be booked online for up to three hours at a time, rather than two. The café on the ground floor will close during the examination period, to make more room for students. Printing services will remain available, but the price of each black and white copy will increase by five cents. Students who need a locker should visit the front desk, where a limited number of lockers will be assigned on a first-come basis. Please check the library website for any further updates.',
    question: 'Which of the following changes does the announcement describe?',
    options: [
      { id: 'a', text: 'The library will open at seven in the morning on weekdays.' },
      { id: 'b', text: 'On weekends, the library will close at nine in the evening.' },
      { id: 'c', text: 'Study rooms can be booked online for up to four hours.' },
      { id: 'd', text: 'The café on the ground floor will stay open.' },
      { id: 'e', text: 'Black and white printing will become cheaper.' },
      { id: 'f', text: 'Lockers can be reserved online before students arrive.' },
    ],
    answers: ['a', 'b'],
  },
  {
    id: 'lmcm-002',
    type: 'listening-mcma',
    title: 'Echolocation',
    difficulty: 2,
    voice: 'male',
    script:
      'Many people think that bats navigate mainly by sight, but most bat species rely heavily on echolocation. A bat emits short bursts of high-pitched sound, often too high for human ears to hear, and then listens for the echoes that bounce back from objects. The timing of each echo tells the animal how far away an object is, and the pattern of the echo reveals its shape and texture. A moth half a metre away produces a very different echo from a moth ten metres away. Researchers have also discovered that bats adjust their calls as they approach a target. As they close in, they emit more frequent pulses, which allows them to track fast-moving insects with great precision. Not all bats use echolocation in the same way. Many fruit bats, for example, have large eyes and rely more on vision and smell to find food. Some species that live in dense forests use quieter calls, so that their prey does not hear them coming. In short, echolocation is a remarkable system, but it is one of several tools that bats use to survive.',
    question: 'According to the talk, which statements about bats are correct?',
    options: [
      { id: 'a', text: 'Most bats find their way mainly by sight.' },
      { id: 'b', text: 'Bats produce sounds and interpret the echoes that come back.' },
      { id: 'c', text: 'The delay between a call and its echo indicates distance.' },
      { id: 'd', text: 'Bats call more frequently as they approach a target.' },
      { id: 'e', text: 'All bat species use echolocation in exactly the same way.' },
    ],
    answers: ['b', 'c', 'd'],
  },
  {
    id: 'lmcm-003',
    type: 'listening-mcma',
    title: 'Rewards programme',
    difficulty: 3,
    script:
      "Good afternoon, and thank you for joining this briefing about changes to the Northfield Coffee rewards programme. Starting next month, the programme will move from a stamp system to a points system, and several other details will change as well. Under the old scheme, customers received one stamp for each drink and collected ten stamps for a free drink. Under the new scheme, every dollar spent earns two points, and a free drink requires three hundred points. Members will also be able to earn points on food items for the first time. Points will expire after twelve months of inactivity, which is a change from the old scheme, where stamps never expired. The company has decided not to raise drink prices as part of this change. However, the minimum spend required to use points on a cake or pastry will increase from five dollars to eight dollars. Staff have been asked to explain the new system at the counter, and an app will show each member's balance. Customers who prefer the old card can keep using it until the end of the year.",
    question: 'Which changes to the rewards programme are described in the briefing?',
    options: [
      { id: 'a', text: 'Points can now be earned on food as well as drinks.' },
      { id: 'b', text: 'Customers will still need ten stamps for a free drink.' },
      { id: 'c', text: 'Unused points expire after twelve months without activity.' },
      { id: 'd', text: 'Drink prices will rise to cover the cost of the change.' },
      { id: 'e', text: 'The minimum spend for pastries will fall.' },
      { id: 'f', text: 'Members must hand back their old card before the change.' },
    ],
    answers: ['a', 'c'],
  },
  {
    id: 'lmcm-004',
    type: 'listening-mcma',
    title: 'Heat safety at work',
    difficulty: 2,
    voice: 'female',
    script:
      'Summer heat can cause serious health problems, especially for people who work outdoors for long hours. This talk covers the warning signs and the simple steps that reduce the risk. Heat exhaustion usually begins with heavy sweating, headache, dizziness and muscle cramps. The person should move to a shaded area, drink cool water in small sips and rest. If the symptoms become worse, for example if the person becomes confused or stops sweating, this may be heat stroke, which is a medical emergency and requires an ambulance immediately. Prevention matters more than treatment. Workers should drink water regularly throughout the shift, not only when they feel thirsty. Light, loose clothing helps the body release heat, and scheduling the heaviest tasks for early morning or evening can reduce the strain. Employers are also responsible for creating a safe environment. They should provide shade, allow regular breaks and monitor new employees closely during their first week, because the body needs several days to adapt to hot conditions. Alcohol is not recommended before or during a shift, since it increases dehydration.',
    question: 'Which statements reflect the advice given in the talk?',
    options: [
      { id: 'a', text: 'Heavy sweating and headache can be early signs of heat exhaustion.' },
      { id: 'b', text: 'Someone with heat exhaustion should drink large amounts of water quickly.' },
      { id: 'c', text: 'Workers should drink only when they feel thirsty.' },
      { id: 'd', text: 'New employees need several days to adjust to hot conditions.' },
      { id: 'e', text: 'Dark, tight clothing helps the body release heat.' },
    ],
    answers: ['a', 'd'],
  },
  {
    id: 'lmcm-005',
    type: 'listening-mcma',
    title: 'Maple syrup',
    difficulty: 3,
    voice: 'male',
    script:
      'Maple syrup is one of the most recognisable food products in Canada, and its production follows a seasonal rhythm. The sap, which is the watery liquid that the tree draws up from its roots in spring, is collected by drilling small holes into the trunk and inserting taps. Sap flows best when nights are below freezing and days are above freezing. This freeze and thaw cycle creates pressure inside the tree, pushing sap out through the taps. A typical sugar maple yields only a few litres of sap a day, so producers often collect from hundreds of trees to make a commercial quantity of syrup. Once collected, the sap is boiled to evaporate most of its water. It takes roughly forty litres of sap to produce one litre of finished syrup, which explains why the product is relatively expensive. Quality is graded by colour and flavour. Early-season sap usually produces lighter, more delicate syrup, while late-season sap yields darker syrup with a stronger taste. Many producers now use reverse osmosis machines to remove water before boiling, which saves fuel and energy.',
    question: 'Which statements about maple syrup production are correct, according to the talk?',
    options: [
      { id: 'a', text: 'Sap is collected directly from the roots of the maple tree.' },
      { id: 'b', text: 'Sap flows most freely when nights are freezing and days are warm.' },
      { id: 'c', text: 'A single tree typically produces a large amount of sap every day.' },
      { id: 'd', text: 'About forty litres of sap are needed for one litre of syrup.' },
      { id: 'e', text: 'Late-season sap usually produces a lighter syrup.' },
      { id: 'f', text: 'Reverse osmosis machines can remove water before the sap is boiled.' },
    ],
    answers: ['b', 'd', 'f'],
  },
  {
    id: 'lmcm-006',
    type: 'listening-mcma',
    title: 'Green bin program',
    difficulty: 2,
    script:
      'The city council has announced that its curbside composting program will be extended to every neighbourhood by the spring. Households in the pilot areas have already been using green bins for food scraps and garden waste for six months, and the results are encouraging. Residents should place fruit and vegetable peelings, coffee grounds, eggshells and small amounts of paper towel in the green bin. Meat, dairy products and cooking oil should not go in the green bin, because they attract animals and can cause odours. Plastic bags, even those labelled compostable, must also be kept out, since they often do not break down at the processing facility. The city collects the green bins once a week, and the material is turned into compost within about two months. Officials estimate that the program will divert around fifteen thousand tonnes of organic waste from the landfill each year. Residents who live in apartment buildings will share a bin, and the building manager will be responsible for keeping the area clean.',
    question: 'Which statements about the composting program are true?',
    options: [
      { id: 'a', text: 'Meat and dairy products can be placed in the green bin.' },
      { id: 'b', text: 'Compostable plastic bags are accepted in the green bin.' },
      { id: 'c', text: 'The green bins are collected once a week.' },
      { id: 'd', text: 'The program will reduce the amount of organic waste sent to landfill.' },
      { id: 'e', text: 'Every apartment resident will receive a private green bin.' },
    ],
    answers: ['c', 'd'],
  },

  // ---------- Listening: Fill in the Blanks (LFIB) ----------
  {
    id: 'lfib-001',
    type: 'listening-fill-blanks',
    title: 'Swimming lessons',
    difficulty: 1,
    voice: 'female',
    transcript:
      "Thank you for calling the community centre. Our adult swimming lessons take place on Tuesday and Thursday evenings, starting at seven o'clock. Please bring a {{1}} and a swimming cap, and arrive ten minutes before the {{2}} begins, so that the instructor can assess your {{3}}. Classes are arranged by level, so if you are unsure which {{4}} suits you, please send us a short message. Refunds are available only if you cancel at least forty-eight hours in advance. We look forward to {{5}} you at the pool.",
    answers: ['towel', 'lesson', 'fitness', 'class', 'welcoming'],
  },
  {
    id: 'lfib-002',
    type: 'listening-fill-blanks',
    title: 'Coral reefs',
    difficulty: 2,
    transcript:
      'Coral reefs depend on a close partnership between coral animals and tiny algae that live inside their tissues. The algae provide {{1}} through photosynthesis, while the coral offers shelter and nutrients. When the water becomes too warm for several weeks, the algae are expelled, and the coral turns {{2}}. This process is called {{3}}. A bleached reef is not necessarily dead, because corals can recover if the algae return. However, repeated {{4}} events leave less time for recovery, and many reefs have already lost a large share of their coral cover. Scientists are testing several {{5}} approaches, including breeding heat-tolerant corals and improving water quality near the coast.',
    answers: ['energy', 'white', 'bleaching', 'heatwave', 'restoration'],
  },
  {
    id: 'lfib-003',
    type: 'listening-fill-blanks',
    title: 'Cycling network',
    difficulty: 2,
    voice: 'male',
    transcript:
      "Good morning, and welcome to this update on the city's cycling network. Over the next two years, the council plans to build {{1}} lanes that are separated from traffic by concrete barriers. The new routes will link the downtown core with the eastern suburbs, and they will include secure bicycle {{2}} at major stations. Construction will begin in the spring, and most work will take place {{3}}, to reduce disruption to buses. Residents can comment on the proposals through the online {{4}}, which closes at the end of the month. Officials say that safer routes should encourage more people to choose a bicycle for their daily {{5}}.",
    answers: ['protected', 'parking', 'overnight', 'consultation', 'commute'],
  },
  {
    id: 'lfib-004',
    type: 'listening-fill-blanks',
    title: 'Ice hockey history',
    difficulty: 1,
    transcript:
      'Ice hockey developed in Canada during the nineteenth century, when players adapted games that were played on frozen ponds and rivers. Early rules were {{1}}, and teams sometimes used a ball instead of a puck. One of the first indoor rinks was built in Montreal in the eighteen sixties. Today, the {{2}} of hockey is a source of national pride, and minor leagues give young players a path to the professional level. Coaches now use video {{3}} to review each game, which helps them {{4}} strategies more precisely than before. Equipment has also {{5}} dramatically, with lighter sticks and helmets that protect players from serious injury.',
    answers: ['informal', 'culture', 'replays', 'refine', 'changed'],
  },
  {
    id: 'lfib-005',
    type: 'listening-fill-blanks',
    title: 'Earthquake safety',
    difficulty: 3,
    voice: 'female',
    transcript:
      'Earthquakes cannot be predicted, but households can reduce the risk of injury. First, secure heavy furniture, such as bookshelves and water heaters, to the {{1}}. Next, prepare an emergency kit with at least three days of {{2}}, and a battery radio. During shaking, drop to the floor, take {{3}} under a sturdy table, and hold on. Do not run outside while the building moves, because falling debris is a {{4}} risk. After the shaking stops, check for gas leaks. If you smell gas, leave the building and {{5}} the emergency services from a safe distance. Practise these steps with your family {{6}}, so everyone knows what to do.',
    answers: ['wall', 'food', 'cover', 'serious', 'contact', 'regularly'],
  },
  {
    id: 'lfib-006',
    type: 'listening-fill-blanks',
    title: 'Documentary films',
    difficulty: 3,
    voice: 'male',
    transcript:
      "This seminar examines how documentary filmmakers shape the stories they tell. Although documentaries are often presented as {{1}} records of reality, every film involves choices: what to film, which interviews to include, and how to {{2}} the material. A sequence of shots can create a sense of {{3}}, even from ordinary footage. Directors also use music and narration to guide the viewer's emotional {{4}}. Some critics argue that this {{5}} on the audience is unavoidable, while others believe filmmakers have a duty to show the subject's own voice. For your assignment, choose one documentary and {{6}} how the director persuades. Be prepared to {{7}} your conclusions in class.",
    answers: ['objective', 'arrange', 'tension', 'response', 'influence', 'analyse', 'defend'],
  },
  {
    id: 'lfib-007',
    type: 'listening-fill-blanks',
    title: 'Antibiotic use',
    difficulty: 2,
    transcript:
      'Antibiotics are among the most important medicines ever developed, yet they are often misused. They work by targeting bacteria, so they have no effect on {{1}} infections such as the common cold. Taking antibiotics when they are not needed can encourage bacteria to become {{2}}, which means the medicine gradually stops working. For this reason, patients should always {{3}} the full course, even when they feel better. Pharmacists can offer {{4}} on minor symptoms, such as sore throats, and may suggest rest and fluids instead. Public health agencies also {{5}} hospitals to track how often antibiotics are prescribed, because overuse is a growing global problem.',
    answers: ['viral', 'resistant', 'finish', 'advice', 'urge'],
  },
  {
    id: 'lfib-008',
    type: 'listening-fill-blanks',
    title: 'Cash flow',
    difficulty: 3,
    transcript:
      'Cash flow is the movement of money into and out of a business. A company can look profitable on paper and still run into trouble if customers take too long to {{1}} their invoices. For this reason, many owners maintain a {{2}} reserve that covers several months of operating costs. Careful forecasting also helps. By listing expected income and expenses every {{3}}, managers can spot shortages early and arrange financing before the situation becomes urgent. Some businesses offer small discounts for early {{4}}, while others charge interest on late ones. Accountants generally advise owners to review their cash position {{5}}, especially during seasonal slowdowns.',
    answers: ['settle', 'cash', 'week', 'payment', 'regularly'],
  },

  // ---------- Highlight Correct Summary (HCS) ----------
  {
    id: 'hcs-001',
    type: 'highlight-correct-summary',
    title: 'Glacier retreat',
    difficulty: 2,
    voice: 'female',
    exams: ['pte-academic'],
    script:
      'In this talk, I want to discuss glaciers in the mountain regions of western Canada. Over the past century, most of these glaciers have shrunk considerably. Scientists measure this retreat by comparing photographs taken decades apart, and by sampling ice thickness with radar. The changes are most visible in summer, when meltwater runoff increases and rivers carry more sediment downstream. Glacier retreat affects more than scenery. Many communities rely on glacial meltwater for irrigation and hydroelectric power, especially during dry summers. In the short term, extra meltwater can increase river flows. In the long term, however, as the ice disappears, that supply will decline, and water shortages may become more common. Researchers are therefore building models to predict how each glacier will respond to different levels of warming.',
    options: [
      {
        id: 'a',
        text: 'Glaciers in western Canada have grown steadily over the past century, which has increased river flows in every season. Scientists therefore see no long-term risk to water supplies, and communities need not plan for shortages during dry summers.',
      },
      {
        id: 'b',
        text: 'The main concern with glacier retreat is the loss of mountain scenery, since meltwater has little effect on communities, farms or hydroelectric power in western Canada. Researchers therefore focus mainly on tourism and photography rather than on water planning.',
      },
      {
        id: 'c',
        text: 'Most glaciers in the region have shrunk, and scientists measure this by comparing old and new photographs as well as sampling ice with radar. Meltwater supports irrigation and power in the short term, but as the ice disappears, water shortages may become more common during dry summers.',
      },
      {
        id: 'd',
        text: 'Glaciers are shrinking mainly in winter, when meltwater runoff peaks and rivers carry more sediment downstream. Scientists rely on satellite images alone, since sampling ice thickness has proved unreliable, and their models ignore dry summers entirely.',
      },
    ],
    answer: 'c',
  },
  {
    id: 'hcs-002',
    type: 'highlight-correct-summary',
    title: 'Tourist crowds',
    difficulty: 2,
    exams: ['pte-academic'],
    script:
      'Historic city centres around the world are struggling with visitor numbers that have grown faster than local infrastructure. In one popular European capital, the number of tourists has doubled in a decade, and residents complain about noise, rising rents and crowded pavements. City planners have tried several responses. The most common is timed entry to major monuments, which spreads visits across the day rather than concentrating them at midday. Some councils have also introduced a tourist levy, and they use the revenue to repair streets and fund public toilets. A more ambitious approach focuses on dispersal. Cities encourage visitors to explore neighbourhoods away from the centre by promoting local markets, galleries and restaurants. The aim is to share economic benefits more widely and to reduce pressure on the most famous sites. Evidence on these measures is still mixed. Timed entry works well for individual attractions, but it can simply move crowds to the next street. Researchers therefore argue that cities need coordinated planning, including transport improvements and clear rules for short-term rentals.',
    options: [
      {
        id: 'a',
        text: 'Cities use several tactics, including timed entry, tourist levies and dispersal to quieter neighbourhoods. Evidence is mixed, so researchers argue that coordinated planning, including transport and short-term rental rules, is needed.',
      },
      {
        id: 'b',
        text: 'Historic cities have found that timed entry solves overcrowding in every case, so most planners now rely on it as their only tool for managing visitor numbers, and few other measures have been tested.',
      },
      {
        id: 'c',
        text: 'Dispersal of visitors is the main method cities use, and it has been shown to lower rents in city centres, because residents move out of crowded areas and into the suburbs. Planners therefore regard it as the simplest and most reliable solution.',
      },
      {
        id: 'd',
        text: 'Tourist levies are the most common response, because they reduce visits to famous monuments directly, and the revenue is used mainly to build new hotels near the historic centre, rather than to repair streets or public facilities.',
      },
    ],
    answer: 'a',
  },
  {
    id: 'hcs-003',
    type: 'highlight-correct-summary',
    title: 'Ocean acidification',
    difficulty: 3,
    exams: ['pte-academic'],
    script:
      'Ocean acidification is often called the other carbon dioxide problem. About a quarter of the carbon dioxide that humans release into the atmosphere is absorbed by the ocean. When carbon dioxide dissolves in seawater, it forms carbonic acid, which increases the acidity of the water and reduces the amount of carbonate available to shellfish, corals and some plankton. The effects are already measurable. In parts of the Pacific, coastal waters have become acidic enough to slow the growth of oyster shells, and shellfish farmers have had to change hatchery procedures. Researchers have also observed that some plankton species are producing thinner shells. Scientists emphasise that acidification is occurring at a speed that is unusual in the geological record. Organisms have had less time to adapt than in past periods of change. The most effective response is therefore to reduce emissions at source, although local measures, such as protecting seagrass meadows, may help some coastal ecosystems in the meantime.',
    options: [
      {
        id: 'a',
        text: 'Ocean acidification is mainly a local problem caused by coastal pollution, so it can be solved by cleaning up shorelines without reducing global emissions. Local measures alone are enough for most ocean ecosystems.',
      },
      {
        id: 'b',
        text: 'Carbon dioxide dissolving in seawater makes the ocean warmer, which is the main reason shellfish are struggling to grow their shells today. Planners therefore focus on cooling coastal waters rather than on reducing acidity.',
      },
      {
        id: 'c',
        text: 'Shellfish farmers have adapted so successfully that acidification has had almost no economic effect, and researchers now consider the problem minor compared with rising sea levels and other threats to coastal communities.',
      },
      {
        id: 'd',
        text: 'Oceans absorb a significant share of human carbon dioxide, which makes seawater more acidic. The change is already affecting shellfish and some plankton, and it is happening faster than most past changes in the ocean.',
      },
    ],
    answer: 'd',
  },
  {
    id: 'hcs-004',
    type: 'highlight-correct-summary',
    title: 'Pumped hydro storage',
    difficulty: 3,
    exams: ['pte-academic'],
    script:
      'Renewable electricity from wind and solar power is variable, which creates a challenge for grid operators. When the sun sets or the wind drops, supply can fall rapidly, so grids need storage that can release energy on demand. Batteries are the fastest-growing option, but they are expensive for long periods of storage. Pumped hydro storage is the oldest and largest form of grid storage. It works by pumping water uphill to a reservoir when electricity is cheap, then letting it flow back down through turbines when demand is high. Pumped hydro currently holds the majority of the world\'s grid storage capacity, and it can supply power for many hours. However, pumped hydro requires specific geography, including two reservoirs at different heights and a suitable site. Construction takes many years and can have significant environmental impacts. Engineers are therefore exploring alternatives, such as storing energy in underground caverns or in heavy weights lifted by cranes.',
    options: [
      {
        id: 'a',
        text: 'Batteries are now the cheapest way to store electricity for long periods, so pumped hydro is no longer used by grid operators anywhere in the world. Storage projects should therefore focus almost entirely on battery technology.',
      },
      {
        id: 'b',
        text: 'Pumped hydro stores energy by moving water between reservoirs at different heights. It holds most of the world\'s grid storage, although it depends on geography and takes many years to build.',
      },
      {
        id: 'c',
        text: 'Wind and solar power are steady sources of electricity, so grid operators rarely need storage, and pumped hydro is mainly used to supply water for farms and irrigation schemes in dry regions.',
      },
      {
        id: 'd',
        text: 'Underground caverns and crane-lifted weights have already replaced pumped hydro, because they are cheaper to build and have no environmental impact at all compared with other forms of energy storage.',
      },
    ],
    answer: 'b',
  },
  {
    id: 'hcs-005',
    type: 'highlight-correct-summary',
    title: 'Urban heat islands',
    difficulty: 2,
    voice: 'female',
    exams: ['pte-academic'],
    script:
      'Cities are often several degrees warmer than the surrounding countryside, a phenomenon known as the urban heat island effect. Dark roofs, asphalt roads and concrete buildings absorb sunlight during the day and release it slowly at night. Dense buildings also block breezes, which would otherwise carry heat away. The effect is strongest on calm, clear evenings, when the difference between city and countryside temperatures can exceed five degrees. This matters for public health, because heat at night prevents the body from recovering after hot days, particularly for older residents and those without air conditioning. Planners have several responses. Green roofs and street trees provide shade and cool the air through evaporation. Light-coloured paving reflects more sunlight, and parks can create cooler zones that benefit nearby neighbourhoods. Many cities now map heat levels street by street to target these measures where they are most needed.',
    options: [
      {
        id: 'a',
        text: 'Cities are warmer mainly because of heat from car engines, so planners should focus solely on reducing traffic to cool neighbourhoods at night. Other measures, such as shade and paving, make little practical difference.',
      },
      {
        id: 'b',
        text: 'The heat island effect appears equally strong on windy days and on calm evenings, so it is best measured using daytime temperatures alone. Night readings add little useful information for planners or for public health staff.',
      },
      {
        id: 'c',
        text: 'Urban areas stay warmer because building materials store and release heat and dense buildings block cooling breezes. Heat is most dangerous at night, so planners use street trees, green roofs and lighter paving to reduce it.',
      },
      {
        id: 'd',
        text: 'Green roofs and street trees have been shown to make cities warmer by holding moisture in the air, so planners have largely abandoned them in favour of dark, reflective materials that trap heat.',
      },
    ],
    answer: 'c',
  },
  {
    id: 'hcs-006',
    type: 'highlight-correct-summary',
    title: 'Roman roads',
    difficulty: 2,
    exams: ['pte-academic'],
    script:
      'Roman roads are among the most durable engineering works of the ancient world, and some sections still carry traffic today. The Romans built them to move legions quickly, to carry messages and to link provincial towns with the capital. At their peak, the network stretched for hundreds of thousands of kilometres across Europe, North Africa and the Middle East. Construction followed a standard method. Engineers first cleared a corridor, then dug trenches and laid successive layers of stone, gravel and sand, often topped with paving slabs. The road surface was usually raised above the surrounding land so that water would drain away and the road would remain passable in wet weather. The roads also had a social function. Milestones marked distances to the nearest towns, and post stations offered horses and lodging to official travellers. Merchants used the network too, which helped spread goods, coins and ideas across the empire. Some modern roads follow the same routes, and archaeologists continue to find evidence of the workmanship that made these roads so enduring.',
    options: [
      {
        id: 'a',
        text: 'Roman engineers used a standard method with layered foundations and raised surfaces to keep the road dry. The network supported armies, officials and merchants, and some modern roads still follow its routes.',
      },
      {
        id: 'b',
        text: 'Roman roads were built mainly for leisure travel, and their surfaces were made of wood, which explains why almost none survive today. Merchants rarely used them, because the cost of travel was too high.',
      },
      {
        id: 'c',
        text: 'Roman roads were built only in Italy and were used exclusively by the military, so merchants had to rely on rivers to move goods across the empire. Post stations were used only by the army.',
      },
      {
        id: 'd',
        text: 'Milestones and post stations were introduced in the modern period, after the Roman road network had been abandoned and largely forgotten by local communities across Europe and beyond, as industrial travel demand grew sharply.',
      },
    ],
    answer: 'a',
  },

  // ---------- Listening: Multiple Choice, Single Answer (LMCS) ----------
  {
    id: 'lmcs-001',
    type: 'listening-mcsa',
    title: 'Bus route change',
    difficulty: 1,
    voice: 'female',
    script:
      'Hello, and welcome to this service update from the regional transit authority. Route fourteen will not stop at Oak Street until further notice. The reason is essential road works on Main Street, which are expected to continue until the end of next month. During this period, buses will use Elm Avenue instead, and passengers can board at the nearest stop on that road. The timetable for all other routes remains unchanged. Customers travelling to the hospital are advised to check the live departure boards before leaving home.',
    question: 'Why will route fourteen temporarily avoid Oak Street?',
    options: [
      { id: 'a', text: 'A new school is being built nearby.' },
      { id: 'b', text: 'Road works are taking place on Main Street.' },
      { id: 'c', text: 'The bus depot is closed for repairs.' },
      { id: 'd', text: 'The winter timetable has reduced service.' },
    ],
    answer: 'b',
  },
  {
    id: 'lmcs-002',
    type: 'listening-mcsa',
    title: 'Glazing technique',
    difficulty: 2,
    script:
      'In traditional oil painting, artists often built up an image in thin, transparent layers, a method known as glazing. Each glaze is a mixture of pigment and a clear medium, and it is applied only once the layer beneath it has dried. Because light passes through the glaze and reflects back from the pale ground below, the colours appear deeper and more luminous than a single opaque layer could achieve. Seventeenth-century Dutch painters used glazing to create the soft, rich surfaces seen in their interior scenes. Modern artists sometimes use glazing too, but many now prefer faster acrylic paints that dry in minutes rather than days.',
    question: 'According to the lecture, what is the main effect of glazing?',
    options: [
      { id: 'a', text: 'It makes the paint dry more quickly.' },
      { id: 'b', text: 'It removes the need for a white ground.' },
      { id: 'c', text: 'It produces deeper, more luminous colours.' },
      { id: 'd', text: 'It reduces the cost of expensive pigments.' },
    ],
    answer: 'c',
  },
  {
    id: 'lmcs-003',
    type: 'listening-mcsa',
    title: 'Desalination',
    difficulty: 2,
    voice: 'male',
    script:
      'Desalination removes salt from seawater, providing drinking water for regions with limited freshwater. The most common method is reverse osmosis, in which seawater is forced through a membrane that allows water molecules to pass but blocks most salt ions. The process requires a great deal of energy, which is why desalinated water is usually more expensive than water from rivers or reservoirs. Plants also produce a concentrated brine, which must be discharged carefully to avoid harming marine life. Recent improvements in membrane design have reduced energy use, although the technology is still most viable in arid coastal regions.',
    question: 'Which statement about desalination is supported by the talk?',
    options: [
      { id: 'a', text: 'Desalination is cheapest in regions with plentiful rivers.' },
      { id: 'b', text: 'Brine from desalination plants poses no environmental risk.' },
      { id: 'c', text: 'Desalinated water is generally cheaper than river water.' },
      { id: 'd', text: 'Reverse osmosis forces water through a membrane that blocks most salt ions.' },
    ],
    answer: 'd',
  },
  {
    id: 'lmcs-004',
    type: 'listening-mcsa',
    title: 'Snow clearing',
    difficulty: 2,
    script:
      "When heavy snow falls overnight, the city's snow crews follow a fixed order of priorities. First, they clear the main emergency routes that connect hospitals, fire stations and police headquarters, so that ambulances and fire engines can respond without delay. Next, they treat the bus routes, so that public transport can resume. School zones come third, followed by bike lanes on major roads. Residential streets are cleared last, usually within forty-eight hours of the storm ending. Residents are asked to keep driveways and hydrants clear, because snowplough drivers cannot work around parked cars.",
    question: 'Which roads does the city clear last?',
    options: [
      { id: 'a', text: 'Residential streets' },
      { id: 'b', text: 'Bus routes' },
      { id: 'c', text: 'Emergency routes' },
      { id: 'd', text: 'School zones' },
    ],
    answer: 'a',
  },
  {
    id: 'lmcs-005',
    type: 'listening-mcsa',
    title: 'Interest rates',
    difficulty: 3,
    voice: 'female',
    script:
      'When inflation rises above target, central banks often increase their policy interest rate. The purpose is to make borrowing more expensive for households and businesses. As loans become costlier, people tend to delay large purchases, such as cars or homes, and companies postpone expansion plans. The resulting slowdown in spending reduces demand, which helps prices stabilise over time. However, interest rate changes take time to work, typically between twelve and eighteen months, so policymakers must act on forecasts rather than current data. Critics point out that higher rates can also raise unemployment, particularly in sectors that depend heavily on credit.',
    question: 'According to the lecture, what is the intended result of raising interest rates?',
    options: [
      { id: 'a', text: 'Borrowing becomes cheaper for households and firms.' },
      { id: 'b', text: 'Spending slows, which eases demand pressure on prices.' },
      { id: 'c', text: 'Central banks set wages directly through interest rate changes.' },
      { id: 'd', text: 'Effects appear within a few days, so policy can react to current data.' },
    ],
    answer: 'b',
  },
  {
    id: 'lmcs-006',
    type: 'listening-mcsa',
    title: 'Hand hygiene history',
    difficulty: 3,
    voice: 'male',
    script:
      'In the mid-nineteenth century, a Hungarian physician named Ignaz Semmelweis noticed that women who gave birth in one Vienna clinic were dying of infection at far higher rates than those in another. The two clinics had similar equipment, but doctors in the first one often performed autopsies before examining patients. Semmelweis required his colleagues to wash their hands in a chlorinated lime solution before every examination, and death rates fell sharply. Yet many senior doctors rejected his conclusions. They could not accept that doctors themselves might carry disease from one patient to the next. Only decades later, after the germ theory of disease had been widely accepted, did hand hygiene become standard practice in hospitals.',
    question: 'Why were Semmelweis\'s findings initially rejected by many of his colleagues?',
    options: [
      { id: 'a', text: 'The clinic lacked enough chlorinated lime.' },
      { id: 'b', text: 'Doctors found hand washing too time-consuming.' },
      { id: 'c', text: 'Colleagues could not accept that doctors might spread disease.' },
      { id: 'd', text: 'Infection rates had already fallen without any changes.' },
    ],
    answer: 'c',
  },

  // ---------- Select Missing Word (SMW) ----------
  {
    id: 'smw-001',
    type: 'select-missing-word',
    title: 'New footbridge',
    difficulty: 1,
    voice: 'male',
    script:
      'The new footbridge across the river was designed so that pedestrians can cross safely even when the water level rises. Engineers chose steel rather than concrete because it is lighter and easier to install. Construction took only eleven months, because most sections were assembled off site and lifted into place. The wide deck allows cyclists and walkers to pass each other without',
    options: [
      { id: 'a', text: 'paying a toll' },
      { id: 'b', text: 'raising their voices' },
      { id: 'c', text: 'slowing down' },
      { id: 'd', text: 'using the stairs' },
    ],
    answer: 'c',
  },
  {
    id: 'smw-002',
    type: 'select-missing-word',
    title: 'Laptop loans',
    difficulty: 1,
    voice: 'female',
    script:
      'Students who want to borrow a laptop from the library should bring their student card and arrive early, because the supply is limited. Each loan lasts for four hours, and laptops must be returned to the front desk before the library closes. Late returns result in a fine of two dollars for every hour, and staff check every device when it comes back. Repeated late returns may lead to',
    options: [
      { id: 'a', text: 'suspension of borrowing rights' },
      { id: 'b', text: 'a higher monthly fee' },
      { id: 'c', text: 'free extra loan periods' },
      { id: 'd', text: 'an earlier closing time' },
    ],
    answer: 'a',
  },
  {
    id: 'smw-003',
    type: 'select-missing-word',
    title: 'Infrared telescopes',
    difficulty: 2,
    script:
      'Astronomers who work with infrared telescopes face a special problem. Infrared detectors are sensitive to heat, including the warmth produced by the telescope itself. To prevent this, the detectors are cooled to temperatures close to absolute zero, and the telescope is shielded from the Sun. Without these precautions, the faint signals from distant galaxies would be drowned out by',
    options: [
      { id: 'a', text: 'a sharper, brighter image' },
      { id: 'b', text: 'stronger magnetic fields' },
      { id: 'c', text: 'fewer detectable stars' },
      { id: 'd', text: 'background noise' },
    ],
    answer: 'd',
  },
  {
    id: 'smw-004',
    type: 'select-missing-word',
    title: 'Honeybee dance',
    difficulty: 2,
    voice: 'female',
    script:
      'Honeybees communicate the location of flowers through a dance. A worker that has found a rich source returns to the hive and performs a figure-eight movement. The angle of the straight section relative to vertical indicates the direction of the flowers relative to the sun, and the length of the waggle run indicates the distance. Other workers watch closely and then leave the hive to search. In this way, a single dance can convey',
    options: [
      { id: 'a', text: 'a warning about predators' },
      { id: 'b', text: 'precise navigation instructions' },
      { id: 'c', text: 'flower colour' },
      { id: 'd', text: 'a request for water' },
    ],
    answer: 'b',
  },
  {
    id: 'smw-005',
    type: 'select-missing-word',
    title: 'Strong currency',
    difficulty: 3,
    script:
      'A central bank that raises interest rates may attract foreign investment, because overseas investors can earn higher returns on deposits and bonds. This increased demand for the domestic currency tends to strengthen its value against other currencies. However, a stronger currency makes exports more expensive for foreign buyers, and it can also make imported goods cheaper for households. Over time, the net effect depends on how exporters respond and how much of the change is passed through to prices. For exporters with fixed-price contracts, however, the effect can be sharp, because they cannot quickly raise prices, and they may',
    options: [
      { id: 'a', text: 'increase export sales' },
      { id: 'b', text: 'weaken the currency' },
      { id: 'c', text: 'hurt export sales' },
      { id: 'd', text: 'reduce foreign investment' },
    ],
    answer: 'c',
  },
  {
    id: 'smw-006',
    type: 'select-missing-word',
    title: 'Running injuries',
    difficulty: 3,
    voice: 'male',
    script:
      'Many runners believe that stretching before a race prevents injury, but studies have found that long static stretches immediately before exercise have little effect on injury rates. Warm-up routines with dynamic movements, such as leg swings and brisk walking, are more effective at preparing the muscles. The best evidence suggests that the most important factor in preventing overuse injuries is',
    options: [
      { id: 'a', text: 'gradually increasing training load' },
      { id: 'b', text: 'stretching for longer periods' },
      { id: 'c', text: 'wearing expensive shoes' },
      { id: 'd', text: 'avoiding any warm-up' },
    ],
    answer: 'a',
  },

  // ---------- Highlight Incorrect Words (HIW) ----------
  {
    id: 'hiw-002',
    type: 'highlight-incorrect-words',
    title: 'Tide pools',
    difficulty: 2,
    text:
      'Tide pools form when the ocean retreats at low tide, leaving small basins of seawater among the rocks. Organisms that live there must survive [gradual|extreme] changes in temperature, salinity and exposure to air. Many species, such as sea stars and anemones, [detach|attach] themselves firmly to the rock surface. Visitors should step carefully, because [durable|fragile] organisms can be crushed underfoot. Removing animals from the pools is [encouraged|prohibited] in most protected coastal areas.',
  },
  {
    id: 'hiw-003',
    type: 'highlight-incorrect-words',
    title: 'Light rail opening',
    difficulty: 1,
    voice: 'female',
    text:
      'The new light rail line will open in the [spring|autumn]. Weekday service will run every [twenty|ten] minutes during the morning and evening rush. On weekends, trains will run every fifteen minutes. Fares will remain the same, and passengers can pay with a [plastic|contactless] card or a mobile phone. The new stations include a stop at the [university|hospital], which will improve access for staff and visitors.',
  },
  {
    id: 'hiw-004',
    type: 'highlight-incorrect-words',
    title: 'Glass recycling',
    difficulty: 3,
    voice: 'male',
    text:
      'Glass is one of the most efficient materials to recycle. Unlike plastic, which [improves|degrades] each time it is reprocessed, glass can be melted and remade without losing its quality. Recycled glass, known as cullet, also [raises|lowers] the temperature needed in furnaces, which saves energy. Every tonne of cullet used in production [requires|avoids] the extraction of raw sand, soda ash and limestone. Yet many households still place glass in general waste, because they are unsure whether the local facility [rejects|accepts] it, and the result is a lot of valuable material sent to landfill.',
  },
  {
    id: 'hiw-005',
    type: 'highlight-incorrect-words',
    title: 'Arabica coffee',
    difficulty: 2,
    voice: 'female',
    text:
      'Arabica coffee is believed to have originated in the highlands of Ethiopia, where wild plants still grow beneath the forest canopy. Unlike robusta, arabica is [less|more] delicate, and it requires [warmer|cooler] temperatures and steady rainfall. Farmers often grow it in shaded plots, which protect the plants from strong sun and help the soil retain moisture. Because the crop is sensitive to weather, a single bad season can [increase|reduce] yields sharply. Many growers are now experimenting with heat-tolerant varieties, although these often produce beans with a [stronger|milder] flavour.',
  },
  {
    id: 'hiw-006',
    type: 'highlight-incorrect-words',
    title: 'Antarctic ice',
    difficulty: 3,
    text:
      "The Antarctic ice sheet holds roughly [ten|seventy] percent of the world's fresh water. Its ice flows slowly towards the coast, where it breaks off as icebergs. Scientists measure this flow using satellites, which detect [large|small] changes in the height of the ice surface. Recent studies show that the western part of the ice sheet is [gaining|losing] mass faster than the eastern part, largely because [cold|warm] ocean water is eroding the ice from below. Even so, the continent's interior remains extremely cold, and its snowfall has been relatively [volatile|stable] over recent decades.",
  },
  {
    id: 'hiw-007',
    type: 'highlight-incorrect-words',
    title: 'Harbour museum',
    difficulty: 1,
    voice: 'female',
    text:
      'Welcome to the Harbour Museum. The main gallery is open every day from [nine|ten] in the morning until five in the evening, and admission is [paid|free] on the first Sunday of each month. The new exhibition on local fishing history is on the [third|second] floor, and it includes a [broken|restored] wooden boat. Visitors can also join a guided tour that starts at the reception desk, and children under [eight|twelve] may use the activity room on the ground floor.',
  },
  {
    id: 'hiw-008',
    type: 'highlight-incorrect-words',
    title: 'Prescribed burning',
    difficulty: 2,
    text:
      'Prescribed burning is a deliberate fire set by land managers to reduce the build-up of [wet|dry] vegetation. In many forests, decades of fire suppression have allowed fuel to accumulate, which makes wildfires more [mild|intense] when they do occur. Crews usually burn during [hot|cool], damp conditions, when the fire is easier to control and smoke disperses more [slowly|quickly]. Careful planning also includes firebreaks, weather forecasts and notifications to nearby residents. Over time, regular low-intensity fires can restore natural habitats and reduce the risk of catastrophic blazes.',
  },

  // ---------- Write from Dictation (WFD) ----------
  {
    id: 'wfd-002',
    type: 'write-from-dictation',
    title: 'Lecture room change',
    difficulty: 1,
    voice: 'female',
    sentence: 'The lecture on marine biology has been moved to room two hundred and twelve.',
  },
  {
    id: 'wfd-003',
    type: 'write-from-dictation',
    title: 'Research proposals',
    difficulty: 1,
    sentence: 'Students must submit their research proposals before the end of the semester.',
  },
  {
    id: 'wfd-004',
    type: 'write-from-dictation',
    title: 'Library at exams',
    difficulty: 1,
    voice: 'male',
    sentence: 'The library will remain open until midnight during the examination period.',
  },
  {
    id: 'wfd-005',
    type: 'write-from-dictation',
    title: 'Measured warming',
    difficulty: 2,
    sentence: 'Researchers observed a significant increase in water temperature over the decade.',
  },
  {
    id: 'wfd-006',
    type: 'write-from-dictation',
    title: 'Laboratory coats',
    difficulty: 1,
    voice: 'female',
    sentence: 'Please ensure that your laboratory coat is fastened before entering the workshop.',
  },
  {
    id: 'wfd-007',
    type: 'write-from-dictation',
    title: 'Economic growth',
    difficulty: 3,
    sentence: 'The professor argued that economic growth depends largely on public investment in education.',
  },
  {
    id: 'wfd-008',
    type: 'write-from-dictation',
    title: 'Internship deadline',
    difficulty: 1,
    voice: 'male',
    sentence: 'Applications for the summer internship close on the first of March.',
  },
  {
    id: 'wfd-009',
    type: 'write-from-dictation',
    title: 'Integrity policy',
    difficulty: 2,
    sentence: 'The committee has approved a new policy on academic integrity and plagiarism.',
  },
  {
    id: 'wfd-010',
    type: 'write-from-dictation',
    title: 'Group presentations',
    difficulty: 2,
    voice: 'female',
    sentence: 'Each group will present its findings to the class during the final seminar.',
  },
  {
    id: 'wfd-011',
    type: 'write-from-dictation',
    title: 'Bus service',
    difficulty: 2,
    sentence: 'The bus service to the north campus will be suspended on public holidays.',
  },
  {
    id: 'wfd-012',
    type: 'write-from-dictation',
    title: 'Methodology workshop',
    difficulty: 3,
    voice: 'male',
    sentence: 'Graduate students are encouraged to attend the methodology workshop on Thursday.',
  },
  {
    id: 'wfd-013',
    type: 'write-from-dictation',
    title: 'Reading list',
    difficulty: 3,
    sentence: 'The reading list includes three articles on urban migration and housing policy.',
  },
  {
    id: 'wfd-014',
    type: 'write-from-dictation',
    title: 'Parking permits',
    difficulty: 1,
    voice: 'female',
    sentence: 'Parking permits can be purchased online or at the transport office on campus.',
  },
  {
    id: 'wfd-015',
    type: 'write-from-dictation',
    title: 'Repeated experiment',
    difficulty: 2,
    sentence: 'The laboratory experiment must be repeated because the results were inconsistent.',
  },
  {
    id: 'wfd-016',
    type: 'write-from-dictation',
    title: 'Colonial trade essay',
    difficulty: 3,
    voice: 'male',
    sentence: 'Her essay examines the relationship between colonial trade and local agriculture.',
  },
  {
    id: 'wfd-017',
    type: 'write-from-dictation',
    title: 'Extra exam time',
    difficulty: 2,
    sentence: 'Students with disabilities may request extra time for the written examinations.',
  },
  {
    id: 'wfd-018',
    type: 'write-from-dictation',
    title: 'Campus shuttle',
    difficulty: 1,
    voice: 'female',
    sentence: 'The campus shuttle runs every fifteen minutes between the library and the residences.',
  },
  {
    id: 'wfd-019',
    type: 'write-from-dictation',
    title: 'Testable hypothesis',
    difficulty: 3,
    sentence: 'A hypothesis must be testable, falsifiable and supported by evidence.',
  },
  {
    id: 'wfd-020',
    type: 'write-from-dictation',
    title: 'Museum hours',
    difficulty: 2,
    voice: 'male',
    sentence: 'The museum has extended its opening hours to accommodate visiting students.',
  },
  {
    id: 'wfd-021',
    type: 'write-from-dictation',
    title: 'Water use',
    difficulty: 3,
    sentence: 'Water consumption in the region has fallen by nearly a fifth since two thousand and ten.',
  },
  {
    id: 'wfd-022',
    type: 'write-from-dictation',
    title: 'Qualitative methods',
    difficulty: 2,
    sentence: 'The seminar will focus on qualitative methods in educational research.',
  },
  {
    id: 'wfd-023',
    type: 'write-from-dictation',
    title: 'Coursework backup',
    difficulty: 1,
    sentence: 'Students should back up their coursework on the university cloud storage service.',
  },
  {
    id: 'wfd-024',
    type: 'write-from-dictation',
    title: 'Departmental budget',
    difficulty: 3,
    voice: 'male',
    sentence: 'The departmental budget was reduced after the government revised its funding formula.',
  },
  {
    id: 'wfd-025',
    type: 'write-from-dictation',
    title: 'Laboratory placements',
    difficulty: 2,
    sentence: 'Every undergraduate must complete a minimum of two laboratory placements.',
  },
  {
    id: 'wfd-026',
    type: 'write-from-dictation',
    title: 'Archive collection',
    difficulty: 2,
    voice: 'female',
    sentence: 'The archive holds letters, photographs and maps from the early settlement period.',
  },
  {
    id: 'wfd-027',
    type: 'write-from-dictation',
    title: 'Student card',
    difficulty: 1,
    sentence: 'Please bring your student card to every examination.',
  },
  {
    id: 'wfd-028',
    type: 'write-from-dictation',
    title: 'Coastal flooding',
    difficulty: 3,
    voice: 'male',
    sentence: 'Climate models suggest that coastal flooding will become more frequent this century.',
  },
  {
    id: 'wfd-029',
    type: 'write-from-dictation',
    title: 'Online module',
    difficulty: 1,
    sentence: 'Participants will receive a certificate once they complete the online module.',
  },
  {
    id: 'wfd-030',
    type: 'write-from-dictation',
    title: 'Questions at meetings',
    difficulty: 2,
    sentence: 'The principal invited questions from parents at the end of the meeting.',
  },
];
