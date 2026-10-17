import type { Item } from '@/core';

/** Original reading items. Owner: content-writing-reading agent. */
export const readingItems: Item[] = [
  {
    id: 'rmcs-001',
    type: 'reading-mcsa',
    title: 'Sleep and memory',
    difficulty: 1,
    passage:
      'Researchers have long suspected that sleep helps us remember. In a recent study, students who slept for eight hours after learning a list of words recalled about 20 percent more of them the next day than students who stayed awake. Brain scans suggested that during deep sleep the hippocampus replays recent experiences, transferring them to longer-term storage in the cortex.',
    question: 'What does the passage suggest about deep sleep?',
    options: [
      { id: 'a', text: 'It prevents the brain from forming new memories.' },
      { id: 'b', text: 'It helps move recent memories into longer-term storage.' },
      { id: 'c', text: 'It is only important for students before exams.' },
      { id: 'd', text: 'It reduces activity in the hippocampus completely.' },
    ],
    answer: 'b',
  },

  // ---------- Reading & Writing: Fill in the Blanks (rwfib) ----------

  {
    id: 'rwfib-001',
    type: 'rw-fill-blanks',
    title: 'Cycling in cities',
    difficulty: 1,
    text:
      'Cycling has become a popular way for many city residents to {{1}}. Dedicated lanes make it safer for riders, and bike-sharing schemes allow people to {{2}} a bicycle for a short trip without owning one. Planners believe that more cyclists would {{3}} traffic congestion and improve air quality. Cities that have built extensive networks often report fewer car journeys in busy districts. Although the initial cost of building lanes can be high, many councils consider the long-term benefits to be {{4}} worth the investment.',
    blanks: [
      { options: ['commute', 'commutes', 'commuting', 'commuted'], answer: 'commute' },
      { options: ['lend', 'rent', 'repair', 'donate'], answer: 'rent' },
      { options: ['reduce', 'reduces', 'reducing', 'reduced'], answer: 'reduce' },
      { options: ['clearly', 'clear', 'clearest', 'clearing'], answer: 'clearly' },
    ],
  },
  {
    id: 'rwfib-002',
    type: 'rw-fill-blanks',
    title: 'Volcanoes in Iceland',
    difficulty: 1,
    text:
      'Iceland is famous for its volcanoes, which {{1}} the landscape with lava fields, black sand beaches and hot springs. Scientists {{2}} the activity of these volcanoes using seismometers, gas sensors and satellite images, so that warning signals can be detected early. When a volcano shows signs of unrest, authorities may {{3}} residents to leave nearby areas until the situation is clear. Although eruptions can disrupt air travel and farming for a time, they also {{4}} fertile soil over many years. Some visitors come specifically to watch eruptions from safe viewpoints, which has become an important source of income for local tour operators.',
    blanks: [
      { options: ['shape', 'shaped', 'shapes', 'shaping'], answer: 'shape' },
      { options: ['monitor', 'monitors', 'monitored', 'monitoring'], answer: 'monitor' },
      { options: ['advise', 'advice', 'advised', 'advisable'], answer: 'advise' },
      { options: ['create', 'creation', 'creative', 'creatively'], answer: 'create' },
    ],
  },
  {
    id: 'rwfib-003',
    type: 'rw-fill-blanks',
    title: 'The town museum',
    difficulty: 1,
    text:
      'The town museum has {{1}} its doors to visitors since 1952, and it now attracts more than fifty thousand people each year. The collection, which includes photographs, tools and clothing, {{2}} the lives of ordinary families in the region. Volunteers {{3}} most of the guided tours, and they are always happy to answer questions. Recently, the museum has {{4}} a new gallery dedicated to the history of local schools, which was funded by a grant from the regional council. Admission is free on the first Sunday of every month.',
    blanks: [
      { options: ['opened', 'open', 'opening', 'opens'], answer: 'opened' },
      { options: ['reflects', 'reflect', 'reflected', 'reflecting'], answer: 'reflects' },
      { options: ['lead', 'leads', 'led', 'leading'], answer: 'lead' },
      { options: ['unveiled', 'unveil', 'unveiling', 'unveils'], answer: 'unveiled' },
    ],
  },
  {
    id: 'rwfib-004',
    type: 'rw-fill-blanks',
    title: 'Vitamin D and sunlight',
    difficulty: 2,
    text:
      'Vitamin D is produced in the skin when it is exposed to sunlight, and it plays an important role in keeping bones strong. People who spend most of their time indoors, or who live far from the equator, may not make enough of it during the winter months. Health authorities therefore {{1}} that some adults take supplements in the darker months. Vitamin D is also {{2}} in foods such as oily fish, eggs and fortified milk, although few diets provide it in large amounts. Doctors can {{3}} a simple blood test to measure a person\'s level of this nutrient, and the result {{4}} whether supplements are needed.',
    blanks: [
      { options: ['advise', 'advice', 'advisable', 'adviser'], answer: 'advise' },
      { options: ['found', 'finding', 'finds', 'find'], answer: 'found' },
      { options: ['order', 'orders', 'ordering', 'ordered'], answer: 'order' },
      { options: ['indicates', 'indicate', 'indicating', 'indicative'], answer: 'indicates' },
    ],
  },
  {
    id: 'rwfib-005',
    type: 'rw-fill-blanks',
    title: 'Inflation and savings',
    difficulty: 2,
    text:
      'When prices rise steadily over time, economists describe the situation as inflation. Inflation {{1}} the purchasing power of money, because each unit of currency buys fewer goods than before. Savers are often {{2}} hardest, particularly if the interest they earn on deposits is lower than the rate of price increases. Central banks usually respond by {{3}} interest rates, which makes borrowing more expensive and can slow spending. However, this policy has consequences, since higher loan repayments may {{4}} households and businesses that have recently taken on debt.',
    blanks: [
      { options: ['reduces', 'reduce', 'reduced', 'reducing'], answer: 'reduces' },
      { options: ['hit', 'hits', 'hitting', 'hiding'], answer: 'hit' },
      { options: ['raising', 'raise', 'raised', 'raises'], answer: 'raising' },
      { options: ['burden', 'burdens', 'burdened', 'burdensome'], answer: 'burden' },
    ],
  },
  {
    id: 'rwfib-006',
    type: 'rw-fill-blanks',
    title: 'Cloud storage',
    difficulty: 2,
    text:
      'Cloud storage allows people to keep files on remote servers instead of their own devices. Users can access documents from almost any location, and many services {{1}} automatic backups, so that information is not lost if a laptop is damaged. Nevertheless, storing personal data online raises concerns about privacy and security, which is why experts advise users to {{2}} strong passwords and two-step verification. Some companies also {{3}} their customers to pay monthly fees once their free storage limit has been reached. Before choosing a provider, it is wise to {{4}} the terms of service carefully, especially the rules about data ownership.',
    blanks: [
      { options: ['offer', 'offers', 'offering', 'offerings'], answer: 'offer' },
      { options: ['use', 'uses', 'used', 'user'], answer: 'use' },
      { options: ['require', 'requires', 'requiring', 'requirement'], answer: 'require' },
      { options: ['read', 'reads', 'reading', 'readable'], answer: 'read' },
    ],
  },
  {
    id: 'rwfib-007',
    type: 'rw-fill-blanks',
    title: 'Spaced repetition',
    difficulty: 2,
    text:
      'Spaced repetition is a study technique in which material is reviewed at increasing intervals rather than all at once. Students who {{1}} this method often remember more after several weeks than those who cram before an exam. The benefit comes from the effort required to recall information, which strengthens the memory each time it is {{2}}. Many learners use digital flashcard programs that schedule reviews automatically, although simple paper calendars work equally well. Teachers also {{3}} students to plan revision sessions early, so that learning is spread across the term instead of {{4}} into one long evening.',
    blanks: [
      { options: ['adopt', 'adopts', 'adopting', 'adoption'], answer: 'adopt' },
      { options: ['recalled', 'recall', 'recalling', 'recalls'], answer: 'recalled' },
      { options: ['encourage', 'encourages', 'encouraged', 'encouragement'], answer: 'encourage' },
      { options: ['cramming', 'crammed', 'crams', 'cram'], answer: 'cramming' },
    ],
  },
  {
    id: 'rwfib-008',
    type: 'rw-fill-blanks',
    title: 'Plastic recycling',
    difficulty: 3,
    text:
      'Plastic recycling has become a priority for many cities, yet the process is {{1}} complicated than most people expect. Collected plastics must be sorted by type, because mixing different materials {{2}} the quality of the recycled product. Some items, such as black trays, cannot be processed by most machines and are therefore sent to landfill. Improving the system depends {{3}} clearer labelling and better cooperation between households and manufacturers. Many experts argue that producers should {{4}} responsibility for packaging that is difficult to recycle. Until then, many recycling centres will continue to accept only the most common types of plastic.',
    blanks: [
      { options: ['more', 'most', 'many', 'few'], answer: 'more' },
      { options: ['reduces', 'reduce', 'reducing', 'reduced'], answer: 'reduces' },
      { options: ['on', 'of', 'to', 'in'], answer: 'on' },
      { options: ['take', 'make', 'create', 'produce'], answer: 'take' },
    ],
  },
  {
    id: 'rwfib-009',
    type: 'rw-fill-blanks',
    title: 'A painter and her reputation',
    difficulty: 3,
    text:
      'The painter Mara Lindqvist is known for her large landscapes, which {{1}} vivid colours and dramatic skies. Although she trained as an architect, she later decided to devote herself {{2}} painting full time. Her early works were rarely exhibited, {{3}} her reputation grew steadily after a solo show in the capital. Critics {{4}} her technique for its precision, but they also point out that her paintings are more emotional than analytical. Today, collectors from several countries compete for her work.',
    blanks: [
      { options: ['feature', 'features', 'featuring', 'featureless'], answer: 'feature' },
      { options: ['to', 'for', 'at', 'on'], answer: 'to' },
      { options: ['yet', 'because', 'unless', 'until'], answer: 'yet' },
      { options: ['praise', 'praises', 'praising', 'praiseworthy'], answer: 'praise' },
    ],
  },
  {
    id: 'rwfib-010',
    type: 'rw-fill-blanks',
    title: 'Parks in dense cities',
    difficulty: 3,
    text:
      'Urban parks provide far more than a pleasant place to walk. Research suggests that residents who live near green spaces tend to {{1}} lower levels of stress, and children are more likely to {{2}} outdoors when playgrounds are close by. In dense districts, however, open land is {{3}} scarce, and high property prices make it difficult to create new parks. Some councils have responded by {{4}} disused car parks into small gardens. Others have {{5}} a rule that every new housing estate must include public space within a short walk of each home.',
    blanks: [
      { options: ['experience', 'experiences', 'experienced', 'experiencing'], answer: 'experience' },
      { options: ['play', 'plays', 'played', 'playing'], answer: 'play' },
      { options: ['increasingly', 'increase', 'increased', 'increasing'], answer: 'increasingly' },
      { options: ['converting', 'converted', 'convert', 'converts'], answer: 'converting' },
      { options: ['introduced', 'introduce', 'introducing', 'introduces'], answer: 'introduced' },
    ],
  },

  // ---------- Reading: Multiple Choice, Multiple Answers (rmcm) ----------

  {
    id: 'rmcm-001',
    type: 'reading-mcma',
    title: 'Mangrove forests',
    difficulty: 2,
    passage:
      'Mangrove forests grow along tropical coastlines, where their dense roots trap sediment and slow the movement of seawater. Over time, this process helps to build new land and protects shorelines from erosion. During storms, mangroves can reduce the height of waves before they reach inland communities, which is why some coastal engineers now consider them a valuable form of natural defence.\n\nMangroves also serve as nurseries for fish and crustaceans. Young animals find shelter among the roots, where predators are less common, and many species that are later caught in the open sea spend their first years in these sheltered waters. Scientists estimate that a large share of commercial fish catches depends, at least partly, on healthy mangrove habitats.\n\nDespite these benefits, mangrove forests have disappeared rapidly in many regions. Clearing land for farms, shrimp ponds and coastal development has removed large areas, and the loss weakens natural protection against flooding. Restoration projects typically replant seedlings in cleared areas, although they succeed only when the new trees are placed where tides and water quality are suitable.',
    question: 'Which of the following statements are supported by the passage? Select all that apply.',
    options: [
      { id: 'a', text: 'Mangrove roots help slow the movement of seawater and trap sediment.' },
      { id: 'b', text: 'Mangroves are the main cause of coastal flooding in tropical regions.' },
      { id: 'c', text: 'Young fish often find shelter among mangrove roots.' },
      { id: 'd', text: 'Most commercial fish species never enter mangrove areas.' },
      { id: 'e', text: 'Replanted seedlings always survive, regardless of tide and water conditions.' },
      { id: 'f', text: 'Clearing mangroves for shrimp ponds has contributed to their decline.' },
      { id: 'g', text: 'Mangroves grow mainly along cold, northern coastlines.' },
    ],
    answers: ['a', 'c', 'f'],
  },
  {
    id: 'rmcm-002',
    type: 'reading-mcma',
    title: 'A community energy cooperative',
    difficulty: 2,
    passage:
      'In a small market town, a group of residents recently formed a cooperative to install solar panels on the roofs of a primary school and a sports hall. Members pay a small fee to join and receive a share of any profits, which are reinvested in further projects. Because the cooperative is owned by its members, decisions about where to build next are made at an annual meeting rather than by a distant company.\n\nThe idea has attracted attention because it keeps money within the local area. When the school saves on electricity bills, the savings can pay for books or equipment, and the cooperative\'s income supports community activities. Some critics argue that such schemes depend too heavily on enthusiastic volunteers, and that they may struggle to raise the large sums needed for bigger projects, such as wind turbines.\n\nSupporters respond that the cooperative has already attracted investment from residents who would not normally buy shares in a company. They also note that installing panels during the first year required careful planning, including surveys of roof strength and agreements with local planners, which the volunteers handled with help from a regional advice centre.',
    question: 'Which of the following statements are supported by the passage? Select all that apply.',
    options: [
      { id: 'a', text: 'The cooperative was formed by a large energy company.' },
      { id: 'b', text: 'Members receive a share of any profits, which are reinvested in further projects.' },
      { id: 'c', text: 'The cooperative has already paid for a new wind turbine.' },
      { id: 'd', text: 'Critics question whether volunteers can sustain the scheme over time.' },
      { id: 'e', text: 'Decisions about future projects are made by an outside company.' },
      { id: 'f', text: 'The school has stopped using electricity altogether.' },
      { id: 'g', text: 'Some residents invested even though they rarely buy company shares.' },
    ],
    answers: ['b', 'd', 'g'],
  },
  {
    id: 'rmcm-003',
    type: 'reading-mcma',
    title: 'The rise of coffeehouses',
    difficulty: 2,
    passage:
      'When coffee first reached Europe in the seventeenth century, it was sold mainly through merchants and apothecaries, who promoted it as a medicine. Within a few decades, however, coffeehouses had opened in many cities, and they quickly became places where people read newspapers, traded news and debated politics. Because admission was often inexpensive, coffeehouses attracted a wide mix of customers, including merchants, writers and tradesmen.\n\nSome rulers viewed these establishments with suspicion, since they feared that political criticism was being spread in them. In several places, authorities attempted to restrict or close coffeehouses, but the bans rarely lasted long, partly because the drink had become too popular to suppress. The coffeehouse also encouraged new commercial habits, as merchants used them to arrange deals and share information about shipping.\n\nHistorians disagree about how much influence coffeehouses had on public opinion. Some argue that they helped create a more open public sphere, while others point out that many patrons were men from privileged backgrounds and that women were largely excluded from these spaces.',
    question: 'Which of the following statements are supported by the passage? Select all that apply.',
    options: [
      { id: 'a', text: 'Coffee was initially promoted in Europe as a form of medicine.' },
      { id: 'b', text: 'Coffeehouses were open only to members of the nobility.' },
      { id: 'c', text: 'Governments succeeded in closing coffeehouses across Europe.' },
      { id: 'd', text: 'Merchants used coffeehouses to arrange business deals.' },
      { id: 'e', text: 'Historians agree that coffeehouses had no effect on public opinion.' },
      { id: 'f', text: 'Many coffeehouse patrons came from privileged backgrounds.' },
      { id: 'g', text: 'Coffeehouses first opened in Europe during the twentieth century.' },
    ],
    answers: ['a', 'd', 'f'],
  },
  {
    id: 'rmcm-004',
    type: 'reading-mcma',
    title: 'Volunteers after a disaster',
    difficulty: 3,
    passage:
      'Emergency services are often the first to arrive after a flood or earthquake, but they cannot reach every affected household quickly. In many regions, local volunteers fill this gap by checking on elderly neighbours, distributing water and helping to clear debris from driveways. Their knowledge of streets, shelters and vulnerable residents can be invaluable in the first hours after a disaster.\n\nSuccessful volunteer networks, however, depend on preparation rather than improvisation. Groups that hold regular training sessions, maintain up-to-date contact lists and agree on communication methods tend to respond more effectively. Some municipalities have also created registers of volunteers, which allow officials to deploy people with specific skills, such as first aid or the operation of generators.\n\nExperts caution that volunteers must be protected as well as supported. Untrained helpers who enter damaged buildings may be injured, and well-meaning activity can sometimes duplicate the work of professionals. For this reason, many agencies now coordinate volunteers through a central point, which assigns tasks and ensures that people are not sent into unsafe areas.',
    question: 'Which of the following statements are supported by the passage? Select all that apply.',
    options: [
      { id: 'a', text: 'Emergency services usually reach every affected household before volunteers do.' },
      { id: 'b', text: 'Local volunteers can offer knowledge that is useful in the first hours after a disaster.' },
      { id: 'c', text: 'Volunteer networks tend to work better when they prepare before a disaster.' },
      { id: 'd', text: 'Untrained helpers should be encouraged to enter damaged buildings.' },
      { id: 'e', text: 'Some municipalities keep registers of volunteers with particular skills.' },
      { id: 'f', text: 'Most agencies have abandoned the practice of coordinating volunteers centrally.' },
      { id: 'g', text: 'Volunteers never duplicate the work of professional responders.' },
    ],
    answers: ['b', 'c', 'e'],
  },
  {
    id: 'rmcm-005',
    type: 'reading-mcma',
    title: 'Recycling electric car batteries',
    difficulty: 3,
    passage:
      'Electric vehicle batteries contain valuable metals, including lithium, cobalt and nickel, which are expensive to mine and process. As the number of electric cars on the road grows, recycling these batteries is becoming an important part of the industry. When a battery no longer holds enough charge for driving, it may still be useful for storing energy in homes or in power grids, a practice known as second life.\n\nOnce a battery can no longer perform any useful function, it must be dismantled and its materials separated. Hydrometallurgy, which uses chemical solutions to dissolve metals, can recover a high proportion of the lithium and cobalt, while mechanical processes such as crushing and sorting prepare materials for further treatment. However, the process is energy-intensive, and the economics depend strongly on the market prices of the recovered metals.\n\nGovernments have begun to introduce rules requiring manufacturers to collect used batteries and to design them so that they can be taken apart more easily. Such regulations aim to build a circular supply chain, although critics argue that they may raise the cost of vehicles and that recycling capacity is still limited in many countries.',
    question: 'Which of the following statements are supported by the passage? Select all that apply.',
    options: [
      { id: 'a', text: 'Electric vehicle batteries contain metals that are costly to extract.' },
      { id: 'b', text: 'Batteries are always discarded once they can no longer power a car.' },
      { id: 'c', text: 'Retired batteries may be used to store energy in homes or power grids.' },
      { id: 'd', text: 'Hydrometallurgy recovers metals without using any chemicals.' },
      { id: 'e', text: 'Recycling batteries is inexpensive and requires very little energy.' },
      { id: 'f', text: 'Some regulations require manufacturers to collect used batteries.' },
      { id: 'g', text: 'Critics believe that battery rules will certainly reduce the cost of cars.' },
    ],
    answers: ['a', 'c', 'f'],
  },
  {
    id: 'rmcm-006',
    type: 'reading-mcma',
    title: 'Murals and neighbourhoods',
    difficulty: 2,
    passage:
      'Murals have decorated walls for thousands of years, but in recent decades they have become a prominent feature of many urban neighbourhoods. In some cities, local councils commission large paintings to brighten underused areas, while in others, artists work informally with residents to portray local history and everyday life.\n\nSupporters argue that murals can strengthen a sense of belonging. When residents help choose the subject or contribute to the painting, the finished work often becomes a point of pride, and it may encourage people to look after the surrounding street. Some projects have also attracted visitors, which has brought modest income to nearby cafés and shops.\n\nNot everyone welcomes these changes, however. Some critics see commissioned murals as a form of decoration that hides deeper social problems, such as poor housing or a lack of services. Others worry that popular murals can lead to rising rents, as property owners and developers seek to profit from the attention a neighbourhood receives. Artists themselves sometimes complain that they are asked to produce work with little payment or long-term security.',
    question: 'Which of the following statements are supported by the passage? Select all that apply.',
    options: [
      { id: 'a', text: 'Murals were first painted in the twentieth century.' },
      { id: 'b', text: 'Involving residents in a mural can increase their sense of pride in it.' },
      { id: 'c', text: 'Critics believe that commissioned murals solve problems such as poor housing.' },
      { id: 'd', text: 'Every mural project has led to higher local rents.' },
      { id: 'e', text: 'Some mural projects have brought modest income to nearby businesses.' },
      { id: 'f', text: 'Artists always receive generous payment for commissioned murals.' },
      { id: 'g', text: 'Some artists are concerned that they are paid little for their work.' },
    ],
    answers: ['b', 'e', 'g'],
  },

  // ---------- Re-order Paragraphs (ro). Ids are shuffled; array order is the correct order. ----------

  {
    id: 'ro-001',
    type: 'reorder-paragraphs',
    title: 'How a seed grows',
    difficulty: 1,
    paragraphs: [
      {
        id: 'c',
        text: 'A plant begins its life as a seed, which contains a tiny embryo and a store of food. Its development depends on water, warmth and air, and each stage follows naturally from the one before.',
      },
      {
        id: 'a',
        text: 'The process starts when a seed absorbs water. As it swells, the outer coat softens, and the embryo becomes active.',
      },
      {
        id: 'e',
        text: 'Next, a small root emerges from the seed and grows downwards into the soil. This root anchors the young plant and begins to draw up water and minerals.',
      },
      {
        id: 'b',
        text: 'Once the root is established, a shoot pushes upwards towards the light. It uses the food stored in the seed until its first leaves can open.',
      },
      {
        id: 'd',
        text: 'Finally, the leaves unfold and begin producing their own food through photosynthesis. At this point, the young plant no longer depends on the seed.',
      },
    ],
  },
  {
    id: 'ro-002',
    type: 'reorder-paragraphs',
    title: 'How volcanic islands form',
    difficulty: 1,
    paragraphs: [
      {
        id: 'b',
        text: 'Volcanic islands form in a series of stages that can take millions of years to complete. The process usually begins deep beneath the ocean floor.',
      },
      {
        id: 'd',
        text: 'Magma rises from the mantle through cracks in the crust and erupts onto the seabed. Each eruption adds layers of lava, and gradually a mound begins to form.',
      },
      {
        id: 'a',
        text: 'Over time, these layers pile up until the summit reaches the surface of the water. At this stage, the new land is often bare rock with little soil.',
      },
      {
        id: 'c',
        text: 'Erosion then breaks the rock into smaller particles, and wind and sea spray carry seeds to the island. Plants slowly colonise the surface, creating the first soil.',
      },
    ],
  },
  {
    id: 'ro-003',
    type: 'reorder-paragraphs',
    title: 'The printing press',
    difficulty: 2,
    paragraphs: [
      {
        id: 'd',
        text: 'The printing press, developed in Germany in the fifteenth century, transformed the way knowledge was shared across Europe. Before its arrival, books had to be copied by hand, which made them expensive and rare.',
      },
      {
        id: 'b',
        text: 'Johannes Gutenberg combined movable metal type with an oil-based ink and a screw press adapted from those used to make wine. This innovation allowed printers to arrange individual letters in a frame and reuse them for different pages.',
      },
      {
        id: 'a',
        text: 'Printing spread rapidly, and within a few decades presses were operating in many towns and cities across the continent. Printers produced religious texts, scientific works and cheap pamphlets, which reached readers who had never owned a book before.',
      },
      {
        id: 'c',
        text: 'Some historians argue that the printing press helped to fuel the scientific revolution, because scholars could compare texts and share findings more easily. Others caution that literacy remained limited and that the effects were gradual rather than sudden.',
      },
    ],
  },
  {
    id: 'ro-004',
    type: 'reorder-paragraphs',
    title: 'How the heart pumps blood',
    difficulty: 2,
    paragraphs: [
      {
        id: 'e',
        text: 'The human heart is a muscular pump with four chambers, two on each side. Its job is to move blood through the body continuously.',
      },
      {
        id: 'c',
        text: 'Blood low in oxygen returns from the body to the right atrium. From there, it flows into the right ventricle, which pumps it to the lungs.',
      },
      {
        id: 'a',
        text: 'In the lungs, the blood releases carbon dioxide and picks up fresh oxygen. The oxygen-rich blood then travels back to the heart and enters the left atrium.',
      },
      {
        id: 'd',
        text: 'The left ventricle, which has the thickest muscular wall, pushes this blood into the aorta. From the aorta, it is distributed to every part of the body.',
      },
      {
        id: 'b',
        text: 'This entire cycle repeats roughly once every second when a person is at rest. Valves within the heart ensure that blood flows in only one direction during each beat.',
      },
    ],
  },
  {
    id: 'ro-005',
    type: 'reorder-paragraphs',
    title: 'A community garden',
    difficulty: 2,
    paragraphs: [
      {
        id: 'b',
        text: 'A community garden in a crowded district began as a single abandoned lot that residents cleaned up on a weekend in spring.',
      },
      {
        id: 'd',
        text: 'After the clean-up, volunteers built raised beds and asked local shops to donate compost and seedlings. The first harvest was small, but it encouraged more people to join.',
      },
      {
        id: 'a',
        text: 'Within two years, the garden had become a meeting place where neighbours swapped recipes, shared tools and taught children how to grow vegetables.',
      },
      {
        id: 'c',
        text: 'Although the project now has a waiting list for plots, its organisers still face challenges, such as securing a water supply and renewing the land lease each year.',
      },
    ],
  },
  {
    id: 'ro-006',
    type: 'reorder-paragraphs',
    title: 'Wetlands and bird migration',
    difficulty: 3,
    paragraphs: [
      {
        id: 'e',
        text: 'Many species of wading birds make long migrations each year, travelling thousands of kilometres between breeding grounds and wintering areas.',
      },
      {
        id: 'a',
        text: 'These journeys depend on a chain of wetlands where birds can rest and feed. Each stopover must provide enough food to restore the energy that the birds have lost.',
      },
      {
        id: 'd',
        text: 'Unfortunately, many of these wetlands have been drained for farming or development, leaving gaps in the chain that can be fatal to migrating flocks.',
      },
      {
        id: 'b',
        text: 'Conservationists have responded by protecting key sites and restoring drained marshes, sometimes with the help of farmers who receive payments for keeping water on their land.',
      },
      {
        id: 'c',
        text: 'Because the success of one site affects many others, researchers now treat the migration route as a single system rather than as a set of separate habitats.',
      },
    ],
  },
  {
    id: 'ro-007',
    type: 'reorder-paragraphs',
    title: 'A water filter company',
    difficulty: 3,
    paragraphs: [
      {
        id: 'd',
        text: 'When the founders first developed their water filter, they expected most of their customers to be hikers and campers who needed a portable product.',
      },
      {
        id: 'a',
        text: 'However, early sales showed that the strongest demand came from families in rural areas where tap water was unreliable. The company therefore redesigned the filter with a larger capacity and a simpler cartridge.',
      },
      {
        id: 'c',
        text: 'This change required a new supplier for the cartridges, and the first batch was delayed by several months. During that time, the founders relied on feedback from customers to decide which features to keep.',
      },
      {
        id: 'b',
        text: 'Once the revised model was released, sales doubled within a year, and the company began to receive requests from schools and clinics. This success suggests that listening to the actual users of a product can matter as much as the original idea.',
      },
    ],
  },
  {
    id: 'ro-008',
    type: 'reorder-paragraphs',
    title: 'Solar eclipses',
    difficulty: 3,
    paragraphs: [
      {
        id: 'b',
        text: 'A solar eclipse occurs when the Moon passes directly between the Sun and the Earth, blocking some or all of the Sun\'s light from reaching a region.',
      },
      {
        id: 'e',
        text: 'The Moon\'s shadow has two parts: the outer penumbra, where the eclipse is only partial, and the darker umbra, where the Sun is completely hidden for a short time.',
      },
      {
        id: 'a',
        text: 'Because the Moon\'s shadow is small compared with the Earth, a total eclipse is visible only from a narrow band of the planet\'s surface.',
      },
      {
        id: 'd',
        text: 'Observers within that band can see the Sun\'s corona, the faint outer atmosphere that is normally outshone by the bright disc. For a few minutes, the sky darkens and temperatures can drop noticeably.',
      },
      {
        id: 'c',
        text: 'Such events were once feared as omens, but astronomers now predict eclipses with great accuracy, which allows people to prepare and observe them safely.',
      },
    ],
  },

  // ---------- Reading: Fill in the Blanks (rfib). Word bank = answers + distractors. ----------

  {
    id: 'rfib-001',
    type: 'reading-fill-blanks',
    title: 'The honeybee dance',
    difficulty: 1,
    text:
      'Honeybees share information about food through a remarkable dance. A worker that has found a rich source of nectar returns to the hive and performs a figure-eight movement, which tells other bees where to find the flowers. The angle of the dance relative to vertical {{1}} the direction of the food, while the length of the straight section indicates the distance. Scientists first {{2}} this behaviour in the 1940s, and later experiments confirmed that the signals are remarkably accurate. Because the information is so precise, the colony can {{3}} its foraging effort towards the best sources. Bees that receive the message then {{4}} the flowers themselves, and the process repeats until the nectar runs out.',
    answers: ['reveals', 'described', 'direct', 'visit'],
    distractors: ['ignored', 'avoided', 'imitated'],
  },
  {
    id: 'rfib-002',
    type: 'reading-fill-blanks',
    title: 'Recycling glass',
    difficulty: 1,
    text:
      'Glass is one of the most recyclable materials in common use. Unlike paper, which loses fibre each time it is processed, glass can be melted and reformed without losing its {{1}}. Broken glass, known as cullet, is often added to fresh raw materials, which {{2}} the amount of sand and soda ash needed. This process also lowers the temperature required in the furnace, so it saves energy. Many cities now provide separate bins for glass, since sorting it {{3}} the material clean enough for remelting. Contaminated pieces, such as ceramics or window glass, can {{4}} an entire batch and create defects in new bottles.',
    answers: ['quality', 'reduces', 'keeps', 'spoil'],
    distractors: ['speed', 'increases', 'freezes'],
  },
  {
    id: 'rfib-003',
    type: 'reading-fill-blanks',
    title: 'Urban heat islands',
    difficulty: 2,
    text:
      'Cities are often several degrees warmer than the surrounding countryside, a phenomenon known as the urban heat island effect. Dark roofs and asphalt roads absorb large amounts of sunlight, and buildings {{1}} that heat slowly during the night. Vegetation, by contrast, cools the air through shade and evaporation. Planners therefore {{2}} tree planting and green roofs as inexpensive ways to lower temperatures. Such measures can cut peak summer temperatures and {{3}} the number of heat-related hospital visits. Some cities also {{4}} reflective paint on pavements, although this surface can {{5}} glare for pedestrians and drivers.',
    answers: ['release', 'promote', 'reduce', 'apply', 'cause'],
    distractors: ['ignore', 'discourage', 'predict'],
  },
  {
    id: 'rfib-004',
    type: 'reading-fill-blanks',
    title: 'Desalination',
    difficulty: 2,
    text:
      'Desalination plants remove salt from seawater, providing drinking water in regions where rainfall is scarce. The most common method, reverse osmosis, forces water through a membrane that {{1}} most of the dissolved salts. Although the technology is now widely used, it requires large amounts of energy, which makes the water more expensive than water from rivers or reservoirs. The concentrated brine left over from the process must also be {{2}} carefully, because discharging it into coastal waters can harm marine life. Engineers are therefore exploring ways to power plants with renewable sources, such as solar panels, and to {{3}} useful materials from the brine. Several countries already {{4}} on desalination for a large share of their household supplies.',
    answers: ['blocks', 'managed', 'extract', 'rely'],
    distractors: ['invites', 'dilutes', 'forgets'],
  },
  {
    id: 'rfib-005',
    type: 'reading-fill-blanks',
    title: 'Crowdfunding',
    difficulty: 2,
    text:
      'Crowdfunding allows entrepreneurs to raise small sums from a large number of people, usually through an online platform. Backers are often {{1}} rewards such as early access to products rather than shares in the company. This model can be especially useful for creative projects that {{2}} to secure conventional loans. However, campaigns that fail to reach their target usually {{3}} all pledges, so creators must set realistic goals. Successful projects {{4}} clear communication with supporters, who often {{5}} updates on progress.',
    answers: ['offered', 'fail', 'return', 'maintain', 'expect'],
    distractors: ['reject', 'purchase', 'donate'],
  },
  {
    id: 'rfib-006',
    type: 'reading-fill-blanks',
    title: 'Tides',
    difficulty: 3,
    text:
      'Tides are the regular rise and fall of sea levels caused mainly by the gravitational pull of the Moon and, to a lesser extent, the Sun. Because the Moon orbits the Earth, the points of greatest pull shift around the planet, so most coastlines experience two high tides and two low tides each day. The height of the tide {{1}} with the position of the Moon and Sun, producing unusually high spring tides when the two align. Coastal communities must take these {{2}} into account when planning ports, harbours and flood defences. Some estuaries have strong tidal currents, which {{3}} sediment and shape the channels over time. Tidal energy, which harnesses this movement, is still limited in scale, but engineers continue to {{4}} new designs.',
    answers: ['varies', 'factors', 'transport', 'test'],
    distractors: ['ignore', 'pause', 'delete'],
  },
  {
    id: 'rfib-007',
    type: 'reading-fill-blanks',
    title: 'The Andes',
    difficulty: 2,
    text:
      'The Andes are the longest continental mountain range on Earth, stretching roughly 7,000 kilometres along the western edge of South America. Their formation {{1}} from the collision between the Nazca and South American tectonic plates, which forced the crust upwards over millions of years. The high altitude {{2}} varied climates, with cold deserts on the windward side and lush forests on the eastern slopes. Many communities have adapted to these conditions, {{3}} terraced farming to grow crops on steep hillsides. Today, the range also {{4}} important mineral deposits, which have made mining a major industry in several countries.',
    answers: ['resulted', 'creates', 'using', 'contains'],
    distractors: ['separated', 'required', 'ignored'],
  },
  {
    id: 'rfib-008',
    type: 'reading-fill-blanks',
    title: 'Concert hall acoustics',
    difficulty: 3,
    text:
      'The acoustics of a concert hall depend on its shape, materials and the way sound waves {{1}} off surfaces. Designers try to make sure that every seat receives a balanced mix of direct and reflected sound, which helps listeners {{2}} the full richness of an orchestra. Soft materials such as heavy curtains tend to absorb sound, so architects often {{3}} them carefully, depending on the type of music. Some halls also use adjustable panels that allow the room to {{4}} its acoustic character for speech or orchestral music. Even small changes can have a noticeable {{5}} on how music is perceived.',
    answers: ['bounce', 'appreciate', 'position', 'alter', 'effect'],
    distractors: ['invent', 'exhaust', 'ignore'],
  },
  {
    id: 'rfib-009',
    type: 'reading-fill-blanks',
    title: 'Fermentation',
    difficulty: 3,
    text:
      'Fermentation is a process in which microorganisms, such as yeast and bacteria, convert sugars into acids, gases or alcohol. It has been used for thousands of years to preserve foods, from bread and cheese to pickled vegetables. As the microbes {{1}}, they produce compounds that give fermented products their distinctive flavours. Many food producers now carefully {{2}} temperature and acidity to ensure consistent results. Although fermentation is often associated with traditional kitchens, it is also {{3}} in modern industry, where it produces medicines, biofuels and enzymes. Scientists continue to {{4}} new strains that might improve these processes.',
    answers: ['multiply', 'monitor', 'widely', 'explore'],
    distractors: ['ignore', 'subtract', 'shrink'],
  },
  {
    id: 'rfib-010',
    type: 'reading-fill-blanks',
    title: 'Glaciers',
    difficulty: 3,
    text:
      'Glaciers are slow-moving rivers of ice that form where snowfall accumulates faster than it melts. Over decades, the weight of new snow compresses older layers, gradually turning them into dense ice. Glaciers {{1}} the landscape as they move, carving valleys and depositing piles of rock called moraines. In recent decades, many glaciers have {{2}} rapidly, which has raised concerns about water supplies in regions that depend on meltwater during dry seasons. Scientists {{3}} satellites to measure changes in ice thickness, and their findings {{4}} that the rate of retreat has accelerated since the 1990s.',
    answers: ['shape', 'retreated', 'use', 'suggest'],
    distractors: ['compress', 'expanded', 'ignore'],
  },

  // ---------- Reading: Multiple Choice, Single Answer (rmcs) ----------

  {
    id: 'rmcs-002',
    type: 'reading-mcsa',
    title: 'Seed banks',
    difficulty: 1,
    passage:
      'Seed banks are facilities that store seeds from wild and cultivated plants so that genetic diversity can be preserved. Most seeds are dried to a low moisture content and kept in freezers at very low temperatures, which slows their ageing dramatically. Some seeds, however, cannot survive drying, and these recalcitrant species must be preserved in other ways, such as growing them in living collections.\n\nSeed banks are useful in several situations. If a crop is hit by disease, breeders can search the stored samples for varieties with natural resistance. Seeds can also be used to restore habitats after land has been damaged by mining or fire. Because a seed bank may hold samples from thousands of species, it acts as a long-term insurance policy against extinction.',
    question: 'According to the passage, why are seeds kept at very low temperatures in seed banks?',
    options: [
      { id: 'a', text: 'Low temperatures help seeds to germinate more quickly.' },
      { id: 'b', text: 'Cold conditions make it possible to store seeds without drying them.' },
      { id: 'c', text: 'Cold storage slows the ageing of seeds that have been dried.' },
      { id: 'd', text: 'Low temperatures allow every species to be preserved in the same way.' },
    ],
    answer: 'c',
  },
  {
    id: 'rmcs-003',
    type: 'reading-mcsa',
    title: 'How Roman roads were built',
    difficulty: 2,
    passage:
      'The Romans built an extensive network of roads that linked the city of Rome with distant provinces. Roads were constructed in layers: engineers first dug a trench, then filled it with rubble and stone, and finally laid paving blocks on a surface that sloped slightly to drain rainwater. Many sections were built so straight that they ran directly over hills rather than around them, which saved time but required considerable labour.\n\nThe roads served military, administrative and commercial purposes. Legions could move quickly to trouble spots, while officials used the network to send orders and collect taxes. Merchants also benefited, since goods could travel in carts and on pack animals more reliably than along unpaved tracks. Although many Roman roads have disappeared, their routes still shape the layout of towns and modern highways in parts of Europe.',
    question: 'According to the passage, how were Roman roads designed to cope with rain?',
    options: [
      { id: 'a', text: 'Their surfaces sloped slightly so that rainwater would drain away.' },
      { id: 'b', text: 'They followed the contours of hills so that construction would be quicker.' },
      { id: 'c', text: 'They were used only by the army to move legions during campaigns.' },
      { id: 'd', text: 'Their paving was made mainly of wood, which absorbed rainwater.' },
    ],
    answer: 'a',
  },
  {
    id: 'rmcs-004',
    type: 'reading-mcsa',
    title: 'Open-plan offices',
    difficulty: 2,
    passage:
      'Open-plan offices were introduced in many companies with the aim of encouraging collaboration and reducing the cost of walls and private rooms. Supporters argue that shared spaces make it easier for colleagues to exchange ideas informally, and that managers can supervise teams more easily when they can see them.\n\nResearch, however, has found mixed results. Many employees report that background conversation and phone calls make it difficult to concentrate, and some studies have linked open layouts to higher levels of stress and more sick days. Interestingly, the design of a space often matters less than the way people are allowed to use it. Offices that combine open areas with quiet rooms and the option to work from home tend to receive more favourable responses from staff.',
    question: 'What does the passage conclude about open-plan offices?',
    options: [
      { id: 'a', text: 'They always increase the amount of collaboration between staff.' },
      { id: 'b', text: 'They have been shown to reduce the number of sick days taken.' },
      { id: 'c', text: 'They are unpopular with managers because they cannot supervise teams.' },
      { id: 'd', text: 'Their effects depend partly on how staff are allowed to use the space.' },
    ],
    answer: 'd',
  },
  {
    id: 'rmcs-005',
    type: 'reading-mcsa',
    title: 'Ocean acidification',
    difficulty: 2,
    passage:
      'As the oceans absorb carbon dioxide from the atmosphere, their chemistry gradually changes. The water becomes more acidic, which lowers the concentration of carbonate ions that many marine organisms need to build shells and skeletons. Shellfish such as oysters and mussels are among the species most affected, particularly in their early life stages, when shells are still forming.\n\nScientists have observed that some coastal areas experience acidity levels that vary greatly over a single day, due to seasonal upwelling, river runoff and the photosynthesis of marine plants. These natural fluctuations complicate the study of long-term change, because organisms in such places may be exposed to conditions that are very different from the open ocean average. Nevertheless, researchers agree that the overall trend is clear.',
    question: 'According to the passage, why are young shellfish especially vulnerable to ocean acidification?',
    options: [
      { id: 'a', text: 'They feed mainly on plants that are damaged by acidic water.' },
      { id: 'b', text: 'Their shells are still forming, and the process requires carbonate ions.' },
      { id: 'c', text: 'They live only in areas where acidity varies from day to day.' },
      { id: 'd', text: 'They absorb more carbon dioxide than adult shellfish do.' },
    ],
    answer: 'b',
  },
  {
    id: 'rmcs-006',
    type: 'reading-mcsa',
    title: 'The placebo effect',
    difficulty: 3,
    passage:
      'The placebo effect describes improvements in health that occur after a patient receives an inactive treatment, such as a sugar pill or a saline injection. For a long time, it was regarded mainly as a nuisance that clinical trials had to control for. Researchers now understand that the effect is real, although it varies widely between conditions. Pain and nausea, for instance, often respond more strongly to placebos than measurable outcomes such as blood pressure.\n\nPart of the explanation lies in expectation. When patients believe a treatment will help, the brain may release natural chemicals that reduce pain or anxiety. The ritual of treatment, the attention of a caring clinician and the setting itself can all contribute. Importantly, the placebo effect does not mean that symptoms are imaginary; it reflects a genuine interaction between mind and body.',
    question: 'Which statement best reflects the passage\'s view of the placebo effect?',
    options: [
      { id: 'a', text: 'It is a genuine response that can influence subjective symptoms such as pain.' },
      { id: 'b', text: 'It proves that patients who report pain are exaggerating their symptoms.' },
      { id: 'c', text: 'It affects blood pressure more strongly than it affects pain.' },
      { id: 'd', text: 'It has been fully explained and no longer needs to be controlled in trials.' },
    ],
    answer: 'a',
  },
  {
    id: 'rmcs-007',
    type: 'reading-mcsa',
    title: 'Dialects and standard languages',
    difficulty: 3,
    passage:
      'Dialects are varieties of a language that differ from one another in vocabulary, pronunciation and grammar. Linguists once described dialects as corrupted forms of a standard language, but this view has largely been abandoned. Every dialect follows consistent rules, and each one reflects the history and social identity of the people who speak it.\n\nStandard languages often emerge from the speech of powerful centres, such as capital cities or royal courts, and they are typically promoted through schools and the media. Their prestige can lead speakers of other varieties to feel that their own speech is inferior. However, many communities maintain dialects with pride, using them to express belonging and humour. The coexistence of dialects and standard forms is therefore common, and most speakers move between them depending on the situation.',
    question: 'What does the passage say about the relationship between dialects and standard languages?',
    options: [
      { id: 'a', text: 'Dialects are gradually replacing standard languages in most schools.' },
      { id: 'b', text: 'Standard languages develop in communities that have rejected dialects.' },
      { id: 'c', text: 'Dialects are inferior to standard languages because they lack consistent rules.' },
      { id: 'd', text: 'Speakers commonly switch between a dialect and a standard form depending on context.' },
    ],
    answer: 'd',
  },
  {
    id: 'rmcs-008',
    type: 'reading-mcsa',
    title: 'Handwritten or typed notes',
    difficulty: 3,
    passage:
      'Researchers comparing note-taking methods have found that handwriting notes can lead to better understanding than typing them, at least for conceptual material. The difference seems to arise because handwriting is slower, so students cannot record every word. They must instead summarise ideas in their own language, which encourages deeper processing.\n\nTyped notes, by contrast, often become verbatim transcripts. Students who copy lectures word for word may feel productive, yet they tend to remember less when the material is tested later. Some researchers suggest combining methods: listening carefully during the lecture, writing brief summaries by hand, and then reviewing them soon afterwards. Such habits appear to matter more than the tool itself.',
    question: 'According to the passage, why might handwritten notes support better understanding?',
    options: [
      { id: 'a', text: 'Students can record every word a lecturer says.' },
      { id: 'b', text: 'Handwriting allows students to avoid reviewing their notes later.' },
      { id: 'c', text: 'The slower pace encourages students to summarise ideas in their own words.' },
      { id: 'd', text: 'Typed notes are always more accurate than handwritten ones.' },
    ],
    answer: 'c',
  },
];
