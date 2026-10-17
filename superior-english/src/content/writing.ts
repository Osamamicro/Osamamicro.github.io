import type { Item } from '@/core';

/** Original writing items (SWT, Essay, Email). Owner: content-writing-reading agent. */
export const writingItems: Item[] = [
  {
    id: 'we-001',
    type: 'write-essay',
    title: 'Remote work and cities',
    difficulty: 2,
    prompt:
      'Some people believe that the rise of remote work will make large cities less important. To what extent do you agree or disagree? Support your opinion with reasons and examples.',
    keyPoints: [
      { label: 'Remote work / working from home', keywords: ['remote work', 'work from home', 'working from home', 'remotely'] },
      { label: 'Role of large cities', keywords: ['city', 'cities', 'urban', 'metropolitan'] },
      { label: 'Economic or social consequences', keywords: ['economy', 'economic', 'property', 'housing', 'business', 'social'] },
    ],
    modelAnswer:
      'The spread of remote work since 2020 has led many commentators to predict the decline of large cities. While I agree that remote work will change the role of cities, I do not believe it will make them significantly less important.\n\nFirstly, remote work clearly reduces the need to live close to an office. Many professionals have moved to smaller towns where housing is cheaper, and some companies have reduced their office space. For example, several technology firms now allow staff to work remotely on a permanent basis, which weakens the economic pull of city centres.\n\nHowever, cities offer much more than offices. They concentrate universities, hospitals, cultural venues and specialised services that cannot be delivered remotely. Moreover, face-to-face networking remains crucial for innovation; research consistently shows that new businesses cluster where talented people meet in person. As a result, many workers who could live anywhere still choose to stay in urban areas.\n\nFinally, the hybrid model that most employers have adopted keeps people tied to cities for at least part of the week. Rather than emptying cities, remote work is more likely to reshape them, converting some office buildings into homes and spreading activity more evenly across neighbourhoods.\n\nIn conclusion, although remote work reduces the importance of the traditional office, large cities will remain essential because of the services, opportunities and social connections they provide. Their form will change, but their importance will endure.',
  },
  {
    id: 'swt-001',
    type: 'summarize-written-text',
    title: 'Green roofs in cities',
    difficulty: 1,
    passage:
      'Green roofs, which are partly or fully covered with plants, are becoming a familiar feature of modern city buildings. Their most obvious benefit is environmental. Vegetation absorbs rainfall, so less water runs off into drains during heavy storms, which reduces the risk of flooding in crowded districts. The soil and leaves also trap dust and pollutants, and they help keep rooftops cooler during hot summer afternoons. They can also provide habitats for bees and birds in districts where green space is scarce.\n\nThe buildings underneath can benefit too. A layer of soil and plants acts as insulation, so less energy is needed for heating in winter and air conditioning in summer. Several city studies have recorded lower energy bills for buildings with green roofs, although the savings vary with the climate and the types of plants that are chosen.\n\nHowever, green roofs are expensive to build. The structure must be strong enough to carry the weight of wet soil, and the waterproofing has to be installed carefully to prevent leaks. For this reason, many local governments now offer grants or tax reductions to owners who install them. Overall, green roofs provide several practical advantages, but their high initial cost means that financial support is often necessary before they become widespread.',
    keyPoints: [
      { label: 'Stormwater and flooding', keywords: ['rainfall', 'flooding', 'storm', 'water'] },
      { label: 'Insulation and energy savings', keywords: ['insulation', 'energy', 'heating', 'bills'] },
      { label: 'High cost and financial support', keywords: ['expensive', 'cost', 'grants', 'financial'] },
    ],
    modelAnswer:
      'Although green roofs reduce flooding, lower the energy that buildings consume, and improve air quality, their high installation cost means that governments often need to offer financial support before owners will adopt them widely.',
  },
  {
    id: 'swt-002',
    type: 'summarize-written-text',
    title: 'Tool libraries',
    difficulty: 2,
    passage:
      'Tool libraries, where residents borrow drills, ladders and garden equipment instead of buying them, have spread across many cities over the past decade. The idea is simple: most household tools are used only a few times a year, so sharing them saves money and reduces the number of items that end up in landfill. Borrowing also gives people access to tools for a single project, such as painting a fence or assembling furniture.\n\nMembers usually pay a small annual fee, and the libraries are often run by volunteers in community centres or repair cafes. Some also offer workshops, where people learn how to use a saw safely or repair a bicycle. In some cities, schools and housing co-operatives have also set up their own lending collections. These lessons encourage practical skills that many people have lost as repairs have become less common.\n\nCritics point out that tool libraries depend heavily on volunteers, and that popular items can be damaged or lost if they are not checked carefully on return. Others argue that libraries serve mainly people who already have time and confidence to do home repairs. Nevertheless, supporters believe that the benefits outweigh these difficulties, particularly in neighbourhoods where residents cannot easily afford expensive equipment.',
    keyPoints: [
      { label: 'Sharing saves money and waste', keywords: ['saves money', 'save money', 'landfill', 'waste', 'sharing'] },
      { label: 'Volunteers and practical workshops', keywords: ['volunteers', 'workshops', 'workshop', 'skills', 'repair'] },
      { label: 'Risks and unequal access', keywords: ['damaged', 'lost', 'confidence', 'afford', 'expensive'] },
    ],
    modelAnswer:
      'Although tool libraries let residents share equipment, reduce waste and learn repair skills, their reliance on volunteers and the risk of damaged items mean that they may mainly benefit people who already have time and confidence to do home repairs.',
  },
  {
    id: 'swt-003',
    type: 'summarize-written-text',
    title: 'Canals and industry',
    difficulty: 2,
    passage:
      'Before railways became widespread in the nineteenth century, canals were the most efficient way to move heavy goods across Britain. A single barge could carry as much coal, iron and grain as dozens of horse-drawn carts, and it did so at a fraction of the cost. As a result, canals helped factory towns to grow by bringing in raw materials and shipping out finished products.\n\nThe canal age was relatively brief. Once railways offered faster journeys that were unaffected by winter ice or drought, many canal companies lost their customers and struggled to pay their debts. Large numbers of waterways were closed or simply abandoned, and some were filled in to make way for new roads and railway lines. Many of the engineers who had built the locks and aqueducts found that their skills were no longer in demand.\n\nToday, many of the surviving canals have been restored for a different purpose. Narrowboats carry holidaymakers along quiet towpaths, and cyclists and walkers use the old routes to pass through cities that were once industrial heartlands. Historians therefore see canals not only as a stage in transport history but also as a lasting part of the landscape and leisure culture.',
    keyPoints: [
      { label: 'Cheap transport of heavy goods', keywords: ['heavy goods', 'cheap', 'barge', 'coal', 'raw materials', 'cost'] },
      { label: 'Decline after railways', keywords: ['railways', 'decline', 'abandoned', 'closed', 'customers'] },
      { label: 'Modern leisure use', keywords: ['leisure', 'holidaymakers', 'walkers', 'cyclists', 'restored'] },
    ],
    modelAnswer:
      'Canals were once a cheap way to carry heavy goods that helped industrial towns grow, but railways later made many of them unprofitable, and today they are valued mainly for leisure.',
  },
  {
    id: 'swt-004',
    type: 'summarize-written-text',
    title: 'Shift work and health',
    difficulty: 2,
    passage:
      'Shift work, which involves regular evening, night or rotating hours, is common in hospitals, factories and transport. Although it keeps essential services running around the clock, it can disrupt the body\'s internal clock, which controls sleep, hunger and hormone levels. Workers on night shifts often report poor sleep during the day and find it hard to recover fully between shifts.\n\nOver time, this disruption has been linked to a higher risk of digestive problems and some long-term conditions, such as heart disease and diabetes. Researchers believe that irregular eating times and reduced physical activity may contribute to these effects, although the exact mechanisms are still being studied.\n\nEmployers can reduce the harm in several ways. They can plan rotas so that shifts rotate forwards, giving workers more time off between blocks, and they can provide rest areas and healthy food options. Individuals also play a part by keeping regular sleep routines, limiting caffeine late in the shift and getting daylight exposure when they wake. Taken together, these measures can make shift work considerably safer.',
    keyPoints: [
      { label: 'Disrupted body clock and sleep', keywords: ['body clock', 'internal clock', 'sleep', 'hormone'] },
      { label: 'Long-term health risks', keywords: ['heart disease', 'diabetes', 'digestive', 'health', 'risk'] },
      { label: 'Employer and individual measures', keywords: ['rotas', 'rota', 'employers', 'routines', 'daylight', 'caffeine'] },
    ],
    modelAnswer:
      'Although shift work keeps essential services running, it disrupts sleep and the body clock, which can raise long-term health risks, so employers and workers should plan rotas and routines carefully.',
  },
  {
    id: 'swt-005',
    type: 'summarize-written-text',
    title: 'Open-source software',
    difficulty: 3,
    passage:
      'Open-source software is code that anyone may inspect, modify and redistribute under licences that protect these freedoms. Many of the tools that run the modern internet, including web servers and programming languages, began as open projects. Their openness allows thousands of independent developers to find and correct errors, which often happens faster than in closed systems where a single company controls the code.\n\nCompanies benefit from this model because they can build products on reliable foundations without paying licence fees. Yet the arrangement also has weaknesses. Many critical projects are maintained by a handful of volunteers who receive little or no payment, and when they lose interest or time, important components can fall into neglect. Security flaws in such components have occasionally affected millions of users.\n\nConsequently, some large technology firms now fund maintainers directly, and foundations have been created to coordinate development and pay for security audits. Such support does not remove the risks, but it reflects a growing recognition that open software depends on sustained investment as much as on enthusiasm.',
    keyPoints: [
      { label: 'Freedom to inspect and modify', keywords: ['inspect', 'modify', 'redistribute', 'freedom', 'open'] },
      { label: 'Faster error detection', keywords: ['errors', 'correct', 'faster', 'thousands', 'developers'] },
      { label: 'Dependence on unpaid maintainers', keywords: ['volunteers', 'maintained', 'funding', 'fund', 'payment', 'investment'] },
    ],
    modelAnswer:
      'Open-source software allows many developers to inspect and correct code quickly, but its reliance on unpaid maintainers means that it needs sustained funding, such as support from companies and foundations.',
  },
  {
    id: 'swt-006',
    type: 'summarize-written-text',
    title: 'Ice cores and past climate',
    difficulty: 3,
    passage:
      'Ice cores are cylinders of ice drilled from thick glaciers and ice sheets, and they provide one of the most detailed records of past climate available to scientists. Each annual layer of snow that fell and compressed into ice contains tiny bubbles of ancient air. By measuring the gases trapped inside these bubbles, researchers can estimate how much carbon dioxide and methane the atmosphere contained thousands of years ago.\n\nThe isotopes of oxygen and hydrogen within the ice itself offer a second clue. Heavier forms of these isotopes tend to be more abundant when temperatures are warmer, so their ratios act as a rough thermometer. When combined with the gas measurements, these readings have helped scientists reconstruct cycles of glacial and interglacial periods over hundreds of thousands of years.\n\nThe method has limits, however. Layers can thin and blur at great depths because of the pressure of the overlying ice, and dating the oldest samples is difficult. Nevertheless, careful comparisons between cores drilled in various locations have strengthened confidence in the results, and the records remain essential for understanding how present-day emissions compare with natural variations in the past.',
    keyPoints: [
      { label: 'Gas bubbles trapped in ice', keywords: ['bubbles', 'gases', 'carbon dioxide', 'methane', 'air'] },
      { label: 'Isotopes as temperature clues', keywords: ['isotopes', 'temperature', 'warmer', 'thermometer'] },
      { label: 'Limits and cross-checking', keywords: ['limits', 'blur', 'dating', 'comparisons', 'cores'] },
    ],
    modelAnswer:
      'Ice cores reveal past climate by analysing gas bubbles and isotopes in ice layers, and although deep layers can blur and old samples are hard to date, scientists compare several cores to check their findings.',
  },
  {
    id: 'swt-007',
    type: 'summarize-written-text',
    title: 'Tourism in historic cities',
    difficulty: 3,
    passage:
      'Tourism brings substantial income to historic cities, supporting hotels, restaurants and museums, and creating jobs in areas that might otherwise decline. In some popular European cities, the number of visitors in the old town can exceed the number of residents during peak months. This concentration can strain public transport, raise rents and make everyday shopping more difficult for local people.\n\nResidents often complain that souvenir shops have replaced bakeries, grocers and hardware stores. As a result, some neighbourhoods have become less attractive to families, and the sense of community that once defined them has weakened. Local councils are therefore experimenting with measures such as limits on short-term holiday lets and charges for entering the most sensitive areas.\n\nSupporters of these measures argue that they protect heritage without ending tourism altogether. They suggest encouraging visitors to travel outside peak seasons, to stay in less crowded districts and to spend more time in the city. Such strategies would spread economic benefits more widely while reducing pressure on the historic core.',
    keyPoints: [
      { label: 'Economic benefits and jobs', keywords: ['income', 'jobs', 'economic', 'hotels', 'benefits'] },
      { label: 'Pressure on housing and services', keywords: ['rents', 'transport', 'crowded', 'pressure', 'shopping'] },
      { label: 'Loss of local shops and community', keywords: ['souvenir', 'bakeries', 'community', 'families', 'local'] },
      { label: 'Policies to spread visitors', keywords: ['holiday lets', 'charges', 'limits', 'spread', 'seasons'] },
    ],
    modelAnswer:
      'Although tourism generates income and jobs for historic cities, it can raise rents, crowd out local shops and push families away, which is why councils are considering limits on holiday lets and visitor charges.',
  },
  {
    id: 'swt-008',
    type: 'summarize-written-text',
    title: 'Music streaming and artists',
    difficulty: 3,
    passage:
      'Music streaming services have changed how people discover and listen to songs, and they now generate the largest share of recorded music revenue in many countries. Subscribers can access millions of tracks for a monthly fee, and playlists curated by algorithms introduce listeners to artists they might never have encountered on the radio.\n\nFor performers, however, the financial picture is more complicated. Each stream typically earns a very small payment, so artists usually need a large number of plays before they receive meaningful royalties. Income is also distributed according to each artist\'s share of total streams, which tends to favour the most popular acts and leaves many less well-known musicians with modest earnings.\n\nSome artists have responded by relying more heavily on live performances, merchandise and fan clubs, where they keep a larger share of the revenue. Others have argued for a different model, in which streaming revenue is divided according to how much each listener actually plays particular artists. Whether such reforms will succeed remains uncertain, but the debate has become central to the future of the industry.',
    keyPoints: [
      { label: 'Access and discovery', keywords: ['streaming', 'playlists', 'discover', 'access', 'listeners'] },
      { label: 'Small payments per stream', keywords: ['small payment', 'royalties', 'per stream', 'earns', 'payment'] },
      { label: 'Unequal distribution', keywords: ['popular', 'favour', 'unequal', 'distribution', 'share'] },
      { label: 'Alternative income and reform', keywords: ['live performances', 'merchandise', 'reform', 'fan clubs', 'model'] },
    ],
    modelAnswer:
      'Although streaming gives listeners easy access to music, its low payments and uneven distribution of royalties mean that many artists earn modest income, so they increasingly depend on concerts and merchandise.',
  },
  {
    id: 'we-002',
    type: 'write-essay',
    title: 'Second language in primary school',
    difficulty: 1,
    prompt:
      'Some people believe that children should begin learning a second language in primary school, while others argue that schools should concentrate on core subjects such as literacy and mathematics. Discuss both views and give your own opinion.',
    keyPoints: [
      { label: 'Benefits of an early start', keywords: ['second language', 'language', 'pronunciation', 'culture', 'curiosity'] },
      { label: 'Pressure on core subjects', keywords: ['literacy', 'mathematics', 'timetable', 'core subjects', 'arithmetic'] },
      { label: 'Conditions for success', keywords: ['opinion', 'planned', 'qualified', 'training', 'playful'] },
    ],
    modelAnswer:
      'Some people believe that children should begin learning a second language in primary school, while others argue that schools should concentrate on core subjects such as literacy and mathematics. Both views have merit, but I believe that an early start to language learning is worthwhile when it is well planned.\n\nOn the one hand, young children find it easier to acquire accurate pronunciation and everyday grammar than adults do. Learning a language early also introduces pupils to other cultures, which can reduce prejudice and build curiosity about the wider world. For example, some teachers report that pupils who begin a second language at six often develop stronger listening skills in their first language as well.\n\nOn the other hand, primary schools already face crowded timetables, and teachers may lack the training to deliver a language course effectively. If lessons are rushed or poorly taught, pupils may become discouraged, and the time taken could reduce the hours available for reading and arithmetic, which are the foundation of all later learning.\n\nIn my view, the benefits outweigh these concerns, provided that language teaching is short, playful and taught by qualified staff. Schools can use songs, games and conversation to build confidence without neglecting core subjects. In conclusion, learning a second language at primary level gives children a valuable head start, but its success depends on careful planning and sufficient teacher training.',
  },
  {
    id: 'we-003',
    type: 'write-essay',
    title: 'Online shopping',
    difficulty: 2,
    prompt:
      'Online shopping has become a normal part of everyday life. What are the advantages and disadvantages of buying goods online? Give reasons and examples to support your answer.',
    keyPoints: [
      { label: 'Convenience and choice', keywords: ['convenience', 'convenient', 'compare prices', 'reviews', 'any hour'] },
      { label: 'Drawbacks and risks', keywords: ['returns', 'packaging', 'waste', 'fraudulent', 'scam', 'local shops'] },
    ],
    modelAnswer:
      'Online shopping has transformed the way people buy everyday goods, and it now accounts for a large share of retail sales in many countries. While it offers clear benefits to consumers, it also brings disadvantages that should not be overlooked.\n\nThe most obvious advantage is convenience. Shoppers can compare prices across dozens of websites, read reviews from other customers and order goods at any hour without leaving home. This is particularly helpful for people who live in rural areas or who have limited mobility, because they can access products that might otherwise be unavailable nearby. Online platforms also make it easier for small producers to reach customers far from their own region.\n\nHowever, online shopping has drawbacks. Many people buy more than they need when they cannot physically handle a product, and returns can be time-consuming. Packaging and delivery vans also add to waste and traffic in cities. Moreover, fraudulent websites sometimes take payment without delivering anything, so buyers must check that a seller is trustworthy.\n\nThe growth of online retail has also put pressure on local shops, which struggle to compete on price and range. Yet many independent retailers have adapted by selling through their own websites or offering click-and-collect services. In conclusion, the advantages of online shopping are substantial, but consumers who use it wisely, and who consider the environmental cost of frequent deliveries, will get the most benefit from it.',
  },
  {
    id: 'we-004',
    type: 'write-essay',
    title: 'Access to scientific research',
    difficulty: 3,
    exams: ['pte-academic'],
    prompt:
      'Access to published research is often limited by subscription fees that many readers cannot afford. What problems does this create, and what solutions would you recommend?',
    keyPoints: [
      { label: 'Problem of unequal access', keywords: ['access', 'subscription', 'paywall', 'afford', 'unequal'] },
      { label: 'Open-access solutions', keywords: ['open access', 'open-access', 'repository', 'publicly funded', 'free'] },
      { label: 'Costs and quality of peer review', keywords: ['peer review', 'quality', 'publication fees', 'charges', 'credibility'] },
    ],
    modelAnswer:
      'Scientific research is usually published in journals that charge subscription fees, so universities and libraries pay large sums to give their staff access to the literature. This arrangement restricts the circulation of knowledge and creates inequalities between well-funded institutions and those with fewer resources. Several solutions have been proposed, and I believe that the most effective approach combines open-access publishing with stronger institutional support.\n\nThe principal problem is one of access. Researchers in developing countries, independent scholars and clinicians working outside universities often cannot read the articles that would inform their work. Because many studies are funded by public money, taxpayers arguably pay twice: once to fund the research and again to read its findings. Furthermore, delays in circulating results can slow progress in urgent fields such as medicine.\n\nOne solution is open-access publishing, in which authors or their funders pay a fee so that articles are free to read immediately. This model has been adopted by many journals and by national funding agencies that require grant recipients to share their results publicly. However, article processing charges can be substantial, and some publishers have used them to generate profit without improving the quality of peer review, which is a genuine concern.\n\nTherefore, a more balanced approach would combine three measures: funders should require open deposition of results, institutions should maintain freely accessible repositories, and publishers should be transparent about their costs. Such measures would widen access while protecting the rigorous review that gives published research its credibility. In conclusion, improving access to knowledge is a shared responsibility, and coordinated policy offers the most realistic path to lasting change.',
  },
  {
    id: 'we-005',
    type: 'write-essay',
    title: 'Public transport versus new roads',
    difficulty: 2,
    prompt:
      'Some people argue that governments should spend more money on public transport than on building new roads. To what extent do you agree or disagree?',
    keyPoints: [
      { label: 'Benefits of public transport', keywords: ['public transport', 'buses', 'trains', 'emissions', 'congestion'] },
      { label: 'Continued need for roads', keywords: ['roads', 'freight', 'rural', 'maintenance', 'goods'] },
      { label: 'Balanced investment', keywords: ['prioritise', 'prioritize', 'balance', 'both', 'planning'] },
    ],
    modelAnswer:
      'Governments face a difficult choice when deciding how to spend limited transport budgets. Many people argue that investment should focus on public transport rather than new roads. I largely agree, although roads remain necessary, particularly for freight and for rural communities.\n\nPublic transport offers a range of advantages that new roads cannot match. A single train or bus can carry many more passengers than a lane of cars, which reduces congestion in crowded cities. It also produces fewer emissions per passenger, and it gives people who cannot drive, including older residents and young people, reliable access to jobs and services. Cities such as Zurich and Copenhagen show how a comprehensive network can make travel efficient and widely used.\n\nNevertheless, new roads are not redundant. Goods must still be moved by road, and many rural areas depend on vehicles because they have no realistic alternative. Furthermore, building more roads without improving public transport often attracts additional traffic, a phenomenon that planners call induced demand, and this can make congestion worse rather than better.\n\nThe most sensible approach is therefore to prioritise public transport while maintaining existing roads and building new ones only where there is a clear need. Careful planning can ensure that both systems complement each other. In conclusion, although governments should not abandon road building altogether, investment in public transport is likely to deliver greater benefits for the majority of citizens.',
  },
  {
    id: 'we-006',
    type: 'write-essay',
    title: 'Entry fees for museums',
    difficulty: 2,
    prompt:
      'Some people believe that museums and art galleries should charge an entry fee so that they can maintain their collections. Others argue that free admission is essential for public access. Discuss both views and give your own opinion.',
    keyPoints: [
      { label: 'Case for entry fees', keywords: ['entry fee', 'entry fees', 'charge', 'maintenance', 'funding', 'collections'] },
      { label: 'Case for free admission', keywords: ['free', 'access', 'everyone', 'families', 'income'] },
      { label: 'Balanced policy', keywords: ['donations', 'compromise', 'balance', 'concessions', 'mixed'] },
    ],
    modelAnswer:
      'Art galleries and museums preserve the cultural heritage of societies, yet they depend on funding that is often uncertain. Some people argue that visitors should pay an entry fee to help maintain collections, while others believe that free admission is essential for public access. Both perspectives have merit, but I think a mixed model, with free entry for residents and modest charges for tourists, offers the fairest solution.\n\nSupporters of entry fees point out that conservation, insurance and building maintenance are expensive. Without additional income, some institutions may be forced to reduce opening hours or stop acquiring new works. Visitors who can afford to pay, including many tourists, can reasonably be expected to contribute to their upkeep.\n\nOpponents, however, emphasise that culture should be available to everyone regardless of income. Charging admission can discourage families, students and older people from visiting, and it may limit the diversity of visitors. Many people who would never buy a ticket to a gallery still benefit from the education and inspiration that such institutions provide.\n\nIn my opinion, a balanced policy would protect both access and sustainability. Governments could fund core operations, while galleries charge tourists or request voluntary donations from visitors who can afford to give. In conclusion, free admission and entry fees need not be mutually exclusive, and a thoughtful combination of the two would serve both the public and the institutions that preserve art for future generations.',
  },
  {
    id: 'we-007',
    type: 'write-essay',
    title: 'Household food waste',
    difficulty: 2,
    prompt:
      'Large quantities of food are thrown away by households every year. What are the main causes of this problem, and what can be done to reduce it?',
    keyPoints: [
      { label: 'Causes: over-buying and date labels', keywords: ['over-buying', 'buying', 'best before', 'use-by', 'labels', 'dates'] },
      { label: 'Solutions for households and shops', keywords: ['planning', 'education', 'portion', 'donate', 'charities', 'compost'] },
    ],
    modelAnswer:
      'Households throw away a remarkable amount of edible food each year, which wastes money, resources and the energy used to produce it. The problem has several causes, but it can be reduced through a combination of better habits, clearer labelling and practical support for consumers.\n\nOne major cause is over-buying. Shoppers often purchase large packs or special offers without a clear plan, and perishable products may spoil before they are used. Confusion about dates also contributes to waste. Many people discard food once the best-before date has passed, even when it remains safe to eat, because they do not understand the difference between a best-before label and a use-by label.\n\nSeveral measures could address these issues. Families can plan weekly meals and prepare shopping lists, which reduces impulse purchases. Governments can run education campaigns explaining how to store food correctly and how to interpret labels. Supermarkets, meanwhile, could offer smaller portion sizes and donate unsold but edible products to charities.\n\nHouseholds can also make creative use of leftovers, and compost is an option for scraps that cannot be eaten. In conclusion, although food waste is a complex problem, practical planning, clearer information and cooperation between shops and charities would make a significant difference to the amount of food that ends up in bins.',
  },
  {
    id: 'we-008',
    type: 'write-essay',
    title: 'Free university tuition',
    difficulty: 3,
    exams: ['pte-academic'],
    prompt:
      'Some people argue that university education should be free for all students, while others believe that students should contribute towards its cost. Discuss both views and give your own opinion.',
    keyPoints: [
      { label: 'Case for free tuition', keywords: ['free', 'tuition', 'equality', 'social mobility', 'debt', 'access'] },
      { label: 'Case for shared costs', keywords: ['contribute', 'cost', 'taxpayers', 'funding', 'quality', 'graduates'] },
      { label: 'Balanced funding model', keywords: ['loans', 'means-tested', 'bursaries', 'scholarships', 'balance'] },
    ],
    modelAnswer:
      'Access to higher education is a central concern for many societies, and debate continues over who should pay for it. Some people argue that university study should be free for every student, while others believe that graduates should contribute towards the cost. In my view, a balanced system in which public funding is combined with targeted support offers the strongest case.\n\nSupporters of free tuition emphasise equality of opportunity. When fees are high, students from low-income families may be discouraged from applying, and those who do enter university often graduate with substantial debt. Free provision would therefore widen participation and encourage talented people from all backgrounds to pursue advanced study, which benefits the economy as a whole.\n\nOpponents, however, point out that taxpayers, many of whom never attend university, would bear the full cost. Without some contribution from students, governments may find it difficult to fund laboratories, libraries and teaching staff at a high standard. Moreover, graduates who earn the highest incomes arguably benefit most from their degrees, so it seems fair that they should share the expense.\n\nA middle path can address both concerns. Governments could fund tuition for students from disadvantaged backgrounds, offer means-tested bursaries, and allow other students to repay loans through their future income. Such arrangements would protect access while ensuring that resources are sustained. In conclusion, free university education has clear social benefits, but a well-designed model that balances public funding with fair contributions is more likely to succeed in the long term.',
  },
  {
    id: 'we-009',
    type: 'write-essay',
    title: 'Space exploration spending',
    difficulty: 3,
    prompt:
      'Some people believe that governments should spend less money on space exploration and more on urgent problems on Earth, such as poverty and disease. To what extent do you agree or disagree?',
    keyPoints: [
      { label: 'Spin-off technologies and satellites', keywords: ['satellites', 'spin-off', 'technology', 'innovation', 'communications'] },
      { label: 'Urgent problems on Earth', keywords: ['poverty', 'disease', 'hunger', 'urgent', 'hospitals', 'climate'] },
      { label: 'Scientific and inspirational value', keywords: ['knowledge', 'monitoring', 'research', 'universe', 'careers'] },
    ],
    modelAnswer:
      'Governments must decide how to allocate limited budgets between ambitious scientific projects and pressing needs at home. Many people argue that money spent on space exploration would be better directed towards poverty and disease. I partly agree with this view, but I believe that space research deserves continued funding because of its practical and scientific value.\n\nThe strongest argument for the critics is that the sums involved are very large, while the benefits of exploration are often long-term and uncertain. A single space mission can cost billions, and that money could fund hospitals, clean water systems or schools for many years. In a world where millions of people lack basic healthcare, it is difficult to justify such expenditure when urgent needs remain unmet.\n\nNevertheless, space research has produced technologies that improve life on Earth. Satellites support weather forecasting, global communications and navigation, and they also help scientists monitor climate change and deforestation. Several advances in materials, medical imaging and computing have roots in projects originally designed for space, which suggests that investment can generate returns far beyond the stars.\n\nMoreover, exploration inspires young people to pursue careers in science and engineering, which strengthens the skills that societies will need to tackle future challenges. The key issue is therefore not whether to fund space research, but how to balance it fairly against social spending. In conclusion, I disagree that space exploration should be cut sharply, although governments should ensure that urgent problems on Earth remain their first priority.',
  },
  {
    id: 'we-010',
    type: 'write-essay',
    title: 'Loneliness among older people',
    difficulty: 1,
    prompt:
      'Many older people in cities live alone and feel isolated. What problems does loneliness cause for them and for society, and what can be done to reduce it?',
    keyPoints: [
      { label: 'Health and wellbeing problems', keywords: ['loneliness', 'isolation', 'health', 'depression', 'wellbeing'] },
      { label: 'Community solutions', keywords: ['community centres', 'volunteers', 'visits', 'social contact', 'neighbours', 'clubs'] },
      { label: 'Technology and family support', keywords: ['technology', 'video calls', 'families', 'phone', 'support'] },
    ],
    modelAnswer:
      'Loneliness is becoming a serious concern in many cities, where older residents may live alone and see few people from one week to the next. Its effects go beyond personal unhappiness, since isolation is linked to poorer health and greater pressure on public services. Fortunately, a combination of community initiatives and practical support can reduce the problem.\n\nThe health consequences of isolation are well documented. Older people who rarely speak to anyone may experience depression, reduced mobility and a weaker appetite, and they may delay seeking medical help. For society, this means more hospital visits and higher long-term costs for families and healthcare providers. In this sense, tackling loneliness is not only a moral responsibility but also a sensible use of public resources.\n\nCommunity organisations can make a real difference. Local community centres can run lunch clubs, exercise classes and craft groups, while volunteers can make regular visits or telephone calls to people who have few other contacts. Such activities give older residents a reason to leave their homes and a chance to build friendships with neighbours of all ages.\n\nTechnology and family members can also play a part. Video calls allow relatives living far away to stay in touch, and simple devices can help people book appointments or join online groups. However, technology should complement rather than replace face-to-face contact. In conclusion, reducing loneliness requires local services, regular volunteer support and encouragement from families, working together to keep older people connected to their communities.',
  },
  {
    id: 'em-001',
    type: 'write-email',
    title: 'Broken heater to landlord',
    difficulty: 1,
    exams: ['pte-core'],
    situation:
      'You rent a one-bedroom apartment in Calgary. The heating has not worked since Monday, and the temperature inside has fallen to around twelve degrees Celsius at night. Write to your landlord, Mr. Patel, to report the problem and ask for a repair.',
    bulletPoints: [
      { label: 'Report the broken heating', keywords: ['heating', 'heater', 'not working', 'broken', 'since monday'] },
      { label: 'Request a repair visit', keywords: ['repair', 'technician', 'visit', 'as soon as possible', 'appointment'] },
      { label: 'Ask about temporary heating costs', keywords: ['temporary heater', 'cost', 'covered', 'reimburse', 'compensation'] },
    ],
    register: 'formal',
    modelAnswer:
      'Dear Mr. Patel,\n\nI am writing to report a problem with the heating in my apartment. The heater has not worked since Monday, and the temperature inside has dropped to around twelve degrees Celsius during the night.\n\nCould you please arrange for a repair technician to visit as soon as possible? If the repair will take more than two days, I would also be grateful if you could confirm whether the cost of a temporary heater will be covered.\n\nThank you for your prompt attention to this matter. I look forward to hearing from you.\n\nKind regards,\nDaniel Okafor',
  },
  {
    id: 'em-002',
    type: 'write-email',
    title: 'Thanks to neighbour',
    difficulty: 1,
    exams: ['pte-core'],
    situation:
      'Your neighbour, Mrs. Lee, accepted a parcel for you while you were away for the weekend. Write her a short email to thank her, say when you will collect the parcel, and offer to help her in return.',
    bulletPoints: [
      { label: 'Thank the neighbour', keywords: ['thank', 'thanks', 'grateful', 'appreciate', 'kindness'] },
      { label: 'When you will collect the parcel', keywords: ['parcel', 'collect', 'pick up', 'tomorrow', 'evening'] },
      { label: 'Offer to help in return', keywords: ['return the favour', 'help', 'happy to help', 'offer', 'coffee'] },
    ],
    register: 'semi-formal',
    modelAnswer:
      'Dear Mrs. Lee,\n\nThank you so much for accepting my parcel while I was away at the weekend. I really appreciate your kindness.\n\nI will collect it from your apartment tomorrow evening after work, if that suits you. Please let me know if another time would be more convenient.\n\nIf there is ever anything I can do to return the favour, such as helping with heavy shopping or watering your plants, please do not hesitate to ask. Perhaps we could have coffee together soon.\n\nBest wishes,\nPriya',
  },
  {
    id: 'em-003',
    type: 'write-email',
    title: 'Enquiry about English classes',
    difficulty: 2,
    exams: ['pte-core'],
    situation:
      'You have recently moved to Vancouver and want to join an evening English class at a community centre. Write to the programme coordinator, Ms. Tanaka, to ask about the class schedule, the fees and the documents you need to bring.',
    bulletPoints: [
      { label: 'Class times', keywords: ['schedule', 'times', 'evening', 'weekday', 'start date'] },
      { label: 'Fees and concessions', keywords: ['fee', 'fees', 'cost', 'concession', 'discount', 'free'] },
      { label: 'Documents to bring', keywords: ['documents', 'bring', 'identification', 'proof', 'address'] },
    ],
    register: 'formal',
    modelAnswer:
      'Dear Ms. Tanaka,\n\nI am writing to enquire about the evening English classes advertised on your centre\'s website. I recently moved to Vancouver and would like to join a course that meets during the week.\n\nCould you please let me know the class schedule, including the start date and the days and times that lessons take place? I would also like to know about the fees and whether any concessions are available for students on a low income.\n\nFinally, please tell me which documents I should bring to the registration session, such as proof of address.\n\nI look forward to hearing from you.\n\nYours sincerely,\nAmir Rahimi',
  },
  {
    id: 'em-004',
    type: 'write-email',
    title: 'Help with moving house',
    difficulty: 1,
    exams: ['pte-core'],
    situation:
      'Your friend Jordan has offered to help you move flat on Saturday. Write a quick, informal email to confirm the plan, ask Jordan to come early, and say what you will provide.',
    bulletPoints: [
      { label: 'Confirm Saturday help', keywords: ['saturday', 'help', 'move', 'free', 'available'] },
      { label: 'Arrive early', keywords: ['early', 'morning', 'start', 'eight', 'loading'] },
      { label: 'Food and drinks', keywords: ['lunch', 'pizza', 'snacks', 'drinks', 'food', 'provide'] },
    ],
    register: 'informal',
    modelAnswer:
      'Hi Jordan,\n\nThanks so much for offering to help me move on Saturday. I really appreciate it, and I know it is a big favour!\n\nCould you come over early in the morning, maybe around eight? The van is booked from nine, so we need to start loading as soon as possible.\n\nI will get lunch and drinks for everyone, so do not worry about bringing anything. Just let me know if you are still free.\n\nCheers,\nSam',
  },
  {
    id: 'em-005',
    type: 'write-email',
    title: 'Request for leave',
    difficulty: 2,
    exams: ['pte-core'],
    situation:
      'You work as an accountant at a medium-sized firm in Toronto. You need to travel abroad to attend a family wedding for five days in November. Write a formal email to your manager, Ms. Sandra Wu, to request leave and explain how your work will be covered.',
    bulletPoints: [
      { label: 'Request leave dates', keywords: ['leave', 'dates', 'from', 'november', 'days'] },
      { label: 'Reason for absence', keywords: ['wedding', 'family', 'travel', 'reason', 'abroad'] },
      { label: 'Cover for your work', keywords: ['cover', 'colleague', 'handover', 'tasks', 'complete', 'deadlines'] },
    ],
    register: 'formal',
    modelAnswer:
      'Dear Ms. Wu,\n\nI am writing to request annual leave from 9 November to 13 November. I need to travel abroad to attend a close family wedding during this period.\n\nBefore my departure, I will complete the monthly reconciliation and prepare a handover document for my colleague, David Chen, who has agreed to cover my client calls. I will also make sure that all deadlines falling within these dates are either met in advance or reassigned.\n\nPlease let me know if you need any further information or would like to discuss the arrangements. Thank you for considering my request.\n\nYours sincerely,\nLaura Bennett',
  },
  {
    id: 'em-006',
    type: 'write-email',
    title: 'Rescheduling a parent-teacher interview',
    difficulty: 2,
    exams: ['pte-core'],
    situation:
      'Your daughter\'s teacher, Mr. Brown, has offered a parent-teacher interview on Tuesday at 4 p.m., but you have a work commitment at that time. Write to him to apologise, suggest alternative times and ask whether he can send a summary of your daughter\'s progress in writing.',
    bulletPoints: [
      { label: 'Apologise and explain the clash', keywords: ['apologise', 'apologies', 'sorry', 'unfortunately', 'work', 'commitment'] },
      { label: 'Suggest alternative times', keywords: ['alternative', 'thursday', 'wednesday', 'times', 'available', 'suggest', 'afternoon'] },
      { label: 'Request a written progress summary', keywords: ['summary', 'progress', 'written', 'report', 'notes', 'send'] },
    ],
    register: 'semi-formal',
    modelAnswer:
      'Dear Mr. Brown,\n\nThank you for offering a parent-teacher interview on Tuesday at 4 p.m. Unfortunately, I am working at that time, and I am sorry for any inconvenience this may cause.\n\nWould Wednesday afternoon or Thursday after school be possible for you? I am flexible, so please tell me which time suits you best.\n\nIf we cannot meet this week, would you be able to send a short written summary of how Lena is progressing in math and reading? That would help me prepare for our conversation.\n\nMany thanks for your patience.\n\nBest regards,\nNadia Haddad',
  },
  {
    id: 'em-007',
    type: 'write-email',
    title: 'Complaint about internet service',
    difficulty: 3,
    exams: ['pte-core'],
    situation:
      'Your home internet connection has been unstable for two weeks, and you have phoned the provider twice without a solution. Write a formal email to the customer service manager, Mr. Robert Singh, describing the problem, the earlier reports and what you expect them to do.',
    bulletPoints: [
      { label: 'Describe the connection problem', keywords: ['unstable', 'connection', 'disconnected', 'slow', 'problem'] },
      { label: 'Earlier reports and reference numbers', keywords: ['reported', 'called', 'reference', 'twice', 'earlier', 'previous'] },
      { label: 'Request a credit or a technician', keywords: ['credit', 'refund', 'technician', 'compensation', 'visit', 'resolve'] },
    ],
    register: 'formal',
    modelAnswer:
      'Dear Mr. Singh,\n\nI am writing to complain about the unstable internet connection, which has disconnected several times a day for the past two weeks. The service is often so slow that I cannot work or join online classes.\n\nI reported this problem by telephone on 3 March and again on 10 March, under reference numbers 48213 and 48790. On both occasions, I was told that a technician would contact me, but nobody has done so.\n\nI would therefore ask you to arrange a technician visit within the next three working days. I also request a credit on my account to compensate for the disruption. Please confirm the action you will take in writing.\n\nYours sincerely,\nMichael Osei',
  },
  {
    id: 'em-008',
    type: 'write-email',
    title: 'Swapping a shift with a colleague',
    difficulty: 2,
    exams: ['pte-core'],
    situation:
      'You work at a grocery store with a colleague named Priya. You would like to swap your Thursday evening shift with her Friday morning shift next week. Write a semi-formal email to suggest the swap, offer something in return and ask her to confirm by Wednesday.',
    bulletPoints: [
      { label: 'Suggest the shift swap', keywords: ['swap', 'switch', 'thursday', 'evening', 'shift'] },
      { label: 'Offer something in return', keywords: ['cover', 'return', 'in return', 'favour', 'extra hours'] },
      { label: 'Ask for confirmation by Wednesday', keywords: ['confirm', 'wednesday', 'let me know', 'reply', 'by'] },
    ],
    register: 'semi-formal',
    modelAnswer:
      'Hi Priya,\n\nI hope your week is going well. I was wondering whether we could swap shifts: I would like to take your Friday morning shift next week, and you could have my Thursday evening shift instead.\n\nIn return, I am happy to cover your next two Saturday shifts or to take any extra hours you need. I know it can be tricky to arrange cover at short notice, so I completely understand if it does not suit you.\n\nCould you let me know by Wednesday? If you agree, I will update the schedule with the manager.\n\nThanks a lot,\nCarlos',
  },
];
