import type { TaskGuide } from '@/core';

/**
 * Original strategy guides, one per task type. Owner: vocab-guides agent.
 * Weights quoted in summaries are the PTE Academic shares (% of the overall score and of each skill).
 * PTE Core has no published weighting here, so Core-only tasks carry no weight figures.
 */
export const guides: TaskGuide[] = [
  // ---------- Speaking & Writing ----------
  {
    taskType: 'read-aloud',
    summary:
      'Read Aloud checks how accurately, fluently and clearly you can read a short passage aloud. It feeds your speaking score only; in PTE Academic it is about 4% of the overall score and about 9% of Speaking.',
    tips: [
      'Use the 35 seconds of preparation to read the passage silently once and mark where you will pause at commas and full stops.',
      'Sound out any unfamiliar names or long technical words in your head before you start recording.',
      'Keep a steady, natural pace. A clear reading at a slightly slower speed usually sounds better than a rushed one.',
      'Stress the content words (nouns, main verbs, adjectives) and let small words such as "the" and "of" stay light.',
      'If you make a small slip, keep going. Correcting a single word costs far less than restarting the sentence.',
      'Content is worth up to 5 points, so read every sentence, including the ones that look difficult.',
    ],
    commonMistakes: [
      'Restarting a whole sentence after a mistake, which wastes time and breaks the flow.',
      'Reading word by word with flat intonation, so the passage sounds like a list.',
      'Ignoring punctuation, which removes the natural pauses and makes the reading hard to follow.',
    ],
  },
  {
    taskType: 'repeat-sentence',
    summary:
      'Repeat Sentence checks how accurately you can hear a sentence and reproduce it word for word. It feeds listening and speaking; in PTE Academic it is about 7% of the overall score, with roughly 10–12 items per test.',
    tips: [
      'You hear the sentence only once, so focus on the first two or three words and on the rhythm of the whole sentence.',
      'Listen in chunks of meaning, such as "the report was published", rather than trying to memorise single words.',
      'Copy the speaker’s stress and intonation, including where the voice rises at a pause and falls at the end.',
      'Start speaking straight after the beep. Preparation time is very short, so practise responding quickly.',
      'Repeat the exact words, even if you know a simpler way to say them. Paraphrasing loses content marks.',
      'Practise for about ten minutes a day with a mix of short and long sentences, and record yourself to compare.',
    ],
    commonMistakes: [
      'Trying to memorise each word separately instead of holding meaningful chunks.',
      'Dropping small words such as "the", "a" or "to", which lowers the content score.',
      'Changing a sentence into a "better" version, so the words no longer match the original.',
    ],
  },
  {
    taskType: 'describe-image',
    summary:
      'Describe Image asks you to describe a chart, graph, table, map or process in detail. It feeds your speaking score; in PTE Academic it is about 15% of the overall score and about 31% of Speaking, the biggest single speaking task.',
    tips: [
      'Use the 25 seconds of preparation to plan three parts: the overall trend, two or three key figures and one conclusion.',
      'Open with one sentence that names the type of visual and its main message, such as "This line graph shows how..."',
      'Choose your figures carefully. The highest and lowest values, the biggest change and the final figure matter most, so you do not need every number.',
      'Use trend language with precise verbs and adverbs, such as "rose sharply", "fell gradually" or "levelled off", and keep your tenses consistent.',
      'Use the full 40 seconds. In PTE Academic you will usually meet about 5–6 Describe Image items, so a repeatable structure saves time.',
      'Practise with a timer and check that every response covers the trend, the key data and a conclusion.',
    ],
    template:
      'This [bar chart / line graph / table / pie chart / map / process diagram] shows [what is measured] in [place or group] from [start year] to [end year].\n\nOverall, [the main trend or message].\n\n[Category or series A] [rose / fell / remained stable] from [value] in [year] to [value] in [year], which is the [highest / lowest / largest change].\n\nIn contrast, [category B] [trend] to [value]. [Second key comparison or figure].\n\nIn conclusion, [your final summary of what the visual shows].',
    commonMistakes: [
      'Reading out every number on the visual, which runs out of time and sounds like a list.',
      'Describing the colours and layout without explaining the trend or what it means.',
      'Stopping without a conclusion, so the response feels unfinished.',
    ],
  },
  {
    taskType: 'retell-lecture',
    summary:
      'Re-tell Lecture asks you to listen to a short lecture and re-tell its main points in your own words. It feeds listening and speaking; in PTE Academic it is about 6% of the overall score, with about 13% of Listening and 13% of Speaking.',
    tips: [
      'Use the 10 seconds of preparation to note the topic and the first key point, not full sentences.',
      'Listen for the structure: the topic, the main points, the examples and the speaker’s conclusion.',
      'Take short notes with keywords, abbreviations and arrows. Do not try to write down the whole lecture.',
      'Begin with the topic in one sentence, then cover each key point in the order the lecture gave them.',
      'Use your own words for the ideas, but keep key names, numbers and technical terms exactly as spoken.',
      'Finish with a short sentence that restates the main message. You have 40 seconds, so aim to use most of it.',
    ],
    template:
      'The lecture is about [topic]. The speaker begins by [first key point]. The speaker then explains that [second key point], and gives the example of [example]. Another important idea is [third key point]. Finally, the speaker concludes that [main conclusion].',
    commonMistakes: [
      'Listing every example in the lecture instead of choosing the main ideas.',
      'Changing key terms or figures, which lowers the content score.',
      'Starting without introducing the topic, so the listener cannot tell what the lecture was about.',
    ],
  },
  {
    taskType: 'answer-short-question',
    summary:
      'Answer Short Question tests how quickly you understand a spoken question and answer it with one word or a short phrase. It feeds listening only; in PTE Academic it is about 2% of the overall score and about 4% of Listening.',
    tips: [
      'Listen for the key word in the question. Most answers are a single word, such as a place, a time, an object or a person.',
      'Answer straight away. The response window is short, so there is no time to plan a long sentence.',
      'Give the most likely word. Add a second word only when the first one alone would be unclear.',
      'Build a bank of common answer types: time words, opposites, family and job words, places and everyday objects.',
      'Do not repeat words from the question. Give only the new information the question asks for.',
      'Practise with short daily drills, saying each answer aloud to build speed and confidence.',
    ],
    commonMistakes: [
      'Answering with a full sentence when one word is enough.',
      'Starting with "um" or "uh" before the answer, which wastes the short response window.',
      'Choosing a word that is close in meaning but not quite the answer the question asks for.',
    ],
  },
  {
    taskType: 'summarize-group-discussion',
    summary:
      'Summarize Group Discussion asks you to listen to several speakers discuss a topic, then summarise the main points and each speaker’s view. It feeds listening and speaking; in PTE Academic it is about 9% of the overall score, with about 20% of Listening and 19% of Speaking.',
    tips: [
      'Use the 10 seconds of preparation to note the topic and give each speaker a short tag, such as "Maya: for" or "Tom: against".',
      'Listen for the disagreement: each speaker’s position, their reason, and any point where the group agrees.',
      'Give each view its own clause, such as "Tom thinks the plan is too expensive because...", rather than quoting directly.',
      'Open with the topic and the group’s overall position, then move through the speakers in the order they spoke.',
      'Use the 120 seconds well. A balanced summary that covers every speaker is worth more than a long quotation.',
      'Finish with one sentence on where the group agrees or differs most strongly.',
    ],
    template:
      'The group discussed [topic]. [Speaker A] believes that [view], because [reason]. [Speaker B] disagrees and argues that [view], pointing out [reason]. [Speaker C] takes a middle position, suggesting [compromise or view]. Overall, the speakers agree that [shared point], but they differ on [main disagreement].',
    commonMistakes: [
      'Summarising only one or two speakers, which leaves the discussion unbalanced.',
      'Quoting speakers word for word instead of paraphrasing their views.',
      'Forgetting to name the topic, so the listener cannot tell what the group discussed.',
    ],
  },
  {
    taskType: 'respond-to-situation',
    summary:
      'Respond to a Situation asks you to read and listen to an everyday problem or request, then respond as you would in real life. It feeds speaking; in PTE Academic it is about 6% of the overall score and about 13% of Speaking.',
    tips: [
      'Use the 20 seconds of preparation to decide who you are speaking to, what you want to achieve and how formal to be.',
      'Address the problem or request in your first sentence, then add one or two supporting details.',
      'Match the register to the listener: polite and formal for a manager, teacher or stranger, relaxed for a friend.',
      'Cover every part of the situation. If it asks you to explain and apologise, make sure both appear.',
      'Sound warm and courteous with phrases such as "Would it be possible to..." or "I am sorry about that."',
      'Use the 40 seconds and end with a polite closing or a question that invites a reply.',
    ],
    template:
      '[Greeting, e.g., Hello Mr Chen / Hi Sam], [I am sorry about / thanks for letting me know about] [the problem]. [Briefly explain what happened and why]. [State what you will do or what you would like]. [Offer a solution or ask a question, e.g., Would it be possible to...? / Could we...?]. [Polite closing].',
    commonMistakes: [
      'Using casual language with a formal listener, or stiff phrases with a friend.',
      'Missing one of the required parts, such as the request or the apology.',
      'Describing the situation as a narrator ("The person should...") instead of speaking directly to the listener.',
    ],
  },
  {
    taskType: 'summarize-written-text',
    summary:
      'Summarize Written Text asks you to read a passage and write one sentence of 5–75 words that captures its main idea. It feeds reading and writing; in PTE Academic it is about 7% of the overall score, with about 23% of Reading and 28% of Writing.',
    tips: [
      'Write exactly one sentence of 5–75 words. Check the word count and make sure there is a single full stop at the end.',
      'Find the main idea first by asking what the writer wants the reader to take away, then build the sentence around it.',
      'Combine the key points with linking words such as "while", "which", "because" or "although" so they fit in one sentence.',
      'Rephrase instead of copying. Replace key words with synonyms and change the grammatical structure where you can.',
      'Leave out examples and small details unless they are essential to the main point.',
      'Plan for about five minutes: read once, note three keywords, draft, then check grammar, punctuation and capital letters.',
    ],
    template:
      '[Main subject] [main claim or action], [although / while / because] [key supporting point or contrast], [which / resulting in] [outcome or implication].',
    commonMistakes: [
      'Writing two or more sentences, which breaks the one-sentence rule.',
      'Copying long phrases from the passage without rephrasing them.',
      'Including minor examples or statistics and missing the main idea.',
    ],
  },
  {
    taskType: 'write-essay',
    summary:
      'Write Essay asks you to write a 200–300 word argument on a given topic, with a clear position and support. It feeds writing only; in PTE Academic it is about 7% of the overall score and about 31% of Writing, the biggest writing task.',
    tips: [
      'Plan for about four minutes: your position, two or three reasons with examples, and a short conclusion.',
      'State your position in the first two sentences of the introduction so the reader knows your view straight away.',
      'Give each body paragraph one main idea, supported by a reason and a concrete example.',
      'Use a range of linking words such as "however", "consequently" and "in addition" to show how your ideas connect.',
      'Aim for 200–300 words. Check your count at the midpoint and near the end, and keep the essay inside the range.',
      'Leave about three minutes to proofread for spelling, verb tense, articles and plural forms, which are easy to fix.',
    ],
    template:
      'Introduction: [Background sentence on the topic.] [Position: In my view, ... / I believe that ... because ...]\n\nBody paragraph 1: [The first reason is ... For example, ...]\n\nBody paragraph 2: [Another important point is ... This is shown by ...]\n\nCounter-argument: [Some people argue that ... However, ...]\n\nConclusion: [In conclusion, ... / Overall, ...]',
    commonMistakes: [
      'Writing outside the 200–300 word range set by the task.',
      'Changing your position halfway through, so the argument becomes inconsistent.',
      'Repeating the same sentence pattern or vocabulary throughout, which lowers the range score.',
      'Ending abruptly without a conclusion.',
    ],
  },
  {
    taskType: 'write-email',
    summary:
      'Write Email asks you to write a 50–120 word email that covers every point in a given situation. It feeds writing; this task appears in PTE Core, where it is scored on content, formality, email conventions and organisation as well as language.',
    tips: [
      'Read the situation and list the bullet points before you write. Each point needs its own sentence or short paragraph.',
      'Choose the greeting and sign-off to match the relationship: "Dear Dr Patel" with "Yours sincerely" for a formal email.',
      'Open with a clear purpose, such as "I am writing to ask...", so the reader knows why you are writing.',
      'Cover the points in the order the task gives them, using short paragraphs to keep the email easy to scan.',
      'Stay within 50–120 words. Aim for about 80 to leave room for checking the wording.',
      'Use polite phrases for requests and apologies, and end with a clear closing line that invites a reply.',
    ],
    template:
      'Subject: [short summary of the purpose]\n\nDear [title and surname, or first name],\n\nI am writing to [purpose of the email]. [Point 1: explain the first bullet point]. [Point 2: explain the second bullet point]. [Point 3: explain the third bullet point]. Could you please [request or action]? I would be grateful for your reply at your earliest convenience.\n\nThank you for your help.\n\n[Kind regards / Yours sincerely],\n[Your name]',
    commonMistakes: [
      'Missing one of the bullet points, which leaves part of the content unanswered.',
      'Using slang or very casual language in a formal email.',
      'Forgetting the greeting, sign-off or subject line, which are standard email conventions.',
    ],
  },
  // ---------- Reading ----------
  {
    taskType: 'rw-fill-blanks',
    summary:
      'Reading & Writing: Fill in the Blanks asks you to choose the best word for each gap from a drop-down list. It feeds reading only; in PTE Academic it is about 7% of the overall score and about 25% of Reading.',
    tips: [
      'Read the whole passage quickly first to understand the topic and tone before you choose any words.',
      'Check the grammar around each gap: the word type, the tense, singular or plural, and any preposition that follows.',
      'Use collocations. Many gaps are answered by the word that naturally goes with its neighbour, such as "make a decision".',
      'Fill the easy gaps first, then use the completed sentences as context for the harder ones.',
      'Choose an option for every gap. A reasoned guess is better than a blank.',
      'PTE Academic usually includes about 5–6 of these items, so the grammar and vocabulary you practise here pays off across the test.',
    ],
    commonMistakes: [
      'Choosing a word that has the right meaning but the wrong grammar, such as a verb where a noun is needed.',
      'Ignoring the preposition that goes with a verb or adjective.',
      'Rushing the first gaps without context, then forcing wrong answers at the end.',
    ],
  },
  {
    taskType: 'reading-mcma',
    summary:
      'Reading: Multiple Choice, Multiple Answers asks you to read a passage and select all the correct answers. It feeds reading; in PTE Academic it is about 1% of the overall score and about 5% of Reading.',
    tips: [
      'Read the question first, then skim the passage for the paragraphs that relate to it.',
      'For each option, decide whether the passage clearly supports it, contradicts it or does not mention it.',
      'Be selective. Each wrong choice costs a point, so include an option only when the passage clearly supports it.',
      'Watch for options that are partly true. They often contain one wrong claim, a reversed cause and effect, or an absolute word such as "all" or "never".',
      'Look for synonyms as well as matching keywords, because the passage often paraphrases its ideas.',
      'The suggested time is about two minutes. PTE Academic usually includes 2–3 of these items, so do not spend too long on one.',
    ],
    commonMistakes: [
      'Selecting every option that relates to the general topic.',
      'Stopping after one correct option and missing the others.',
      'Overlooking a small word such as "not" or "only" that changes an option’s meaning.',
    ],
  },
  {
    taskType: 'reorder-paragraphs',
    summary:
      'Re-order Paragraphs asks you to put shuffled paragraphs back into their logical order. It feeds reading; in PTE Academic it is about 3% of the overall score and about 9% of Reading. Each correct adjacent pair earns credit, so partly correct orders still score.',
    tips: [
      'Find the opening paragraph first. It introduces the topic and does not refer back to anything earlier.',
      'Look for linking clues such as pronouns ("this", "they"), time markers and connectives such as "however" or "as a result".',
      'Build the order in pairs: for each paragraph, ask which one naturally comes next.',
      'Identify the closing paragraph, which often sums up the argument or points towards a conclusion.',
      'Place every paragraph. Each correct adjacent pair scores, so one misplaced paragraph does not cancel out the rest.',
      'Keep to the suggested two and a half minutes and move on rather than getting stuck.',
    ],
    commonMistakes: [
      'Starting with a paragraph that refers back to an idea, such as "This approach", without any context.',
      'Ignoring pronouns and linking words, which hold the sequence together.',
      'Reading every paragraph in full before ordering. Scanning for clues is faster and is usually enough.',
    ],
  },
  {
    taskType: 'reading-fill-blanks',
    summary:
      'Reading: Fill in the Blanks asks you to fill gaps in a passage using words from a word bank, which includes some extra words. It feeds reading only; in PTE Academic it is about 6% of the overall score and about 20% of Reading.',
    tips: [
      'Read the whole passage once for meaning before you fill any gap.',
      'For each gap, work out the word type from the grammar around it, then look for a word in the bank that fits.',
      'Think about collocations: a word often pairs naturally with the words next to it.',
      'Remember that some words in the bank are extra. Do not force a word into a gap just because it is left.',
      'Keep track of the words you have already placed, since each word normally fits only one gap.',
      'Reread the completed passage to check that every sentence makes sense.',
    ],
    commonMistakes: [
      'Filling each gap on its own without thinking about the sentence or paragraph.',
      'Choosing a word that fits the grammar but not the meaning of the passage.',
      'Assuming every word in the bank has to be used.',
    ],
  },
  {
    taskType: 'reading-mcsa',
    summary:
      'Reading: Multiple Choice, Single Answer asks you to read a passage and select the one correct answer. It feeds reading; in PTE Academic it is under 1% of the overall score and about 3% of Reading.',
    tips: [
      'Read the question first, then scan the passage for the keywords it contains.',
      'Expect distractors: options that are true about the passage but do not answer the question that was asked.',
      'For questions about the main idea or purpose, think about what the whole passage is trying to do.',
      'Eliminate the clearly wrong options first. This often narrows the choice to two, which is easier to decide between.',
      'Check that your answer is supported by the text, not by what you already know about the topic.',
      'Aim for about 90 seconds per question, and move on if you are stuck.',
    ],
    commonMistakes: [
      'Choosing an answer because it matches your existing knowledge rather than the passage.',
      'Answering a different question, such as giving the cause when the question asks for the effect.',
      'Spending too long on one difficult question and rushing the rest.',
    ],
  },
  // ---------- Listening ----------
  {
    taskType: 'summarize-spoken-text',
    summary:
      'Summarize Spoken Text asks you to listen to a recording and write a 50–70 word summary. It feeds listening and writing; in PTE Academic it is about 4% of the overall score, with about 10% of Listening and 18% of Writing.',
    tips: [
      'Take short notes while you listen: keywords, names, numbers and the speaker’s main conclusion, not full sentences.',
      'Identify the main idea and two or three supporting points, then lead your summary with the main idea.',
      'Write one clear paragraph of 50–70 words. Count your words before you finish.',
      'Paraphrase the speaker’s language rather than copying phrases word by word.',
      'Leave time to proofread spelling, capital letters, punctuation and subject-verb agreement, which all affect your score.',
      'Practise with short, timed recordings and compare your summary with the notes you made.',
    ],
    template:
      'The recording discusses [topic]. [Speaker or group] explains that [main idea]. [Key point 1], which [why it matters]. [Key point 2, with an example or figure]. Overall, the speaker concludes that [main conclusion].',
    commonMistakes: [
      'Writing a transcript of what the speaker said, which runs over the word limit.',
      'Including minor details or examples while leaving out the main conclusion.',
      'Going outside the 50–70 word range, which affects the form score.',
    ],
  },
  {
    taskType: 'listening-mcma',
    summary:
      'Listening: Multiple Choice, Multiple Answers asks you to listen and select all the correct options. It feeds listening; in PTE Academic it is about 1% of the overall score and about 3% of Listening.',
    tips: [
      'Read the options before the audio starts so you know what kind of information to listen for.',
      'Note each option as you hear it, marking it as stated, contradicted or not mentioned, rather than trying to remember everything at the end.',
      'Be selective. Each wrong choice costs a point, so select only the options you are confident the speaker stated.',
      'Listen for paraphrases. The speaker may say "lowered" when the option says "reduced".',
      'Keep listening after you have a first answer, because other correct options may come later in the recording.',
      'PTE Academic usually includes 2–3 of these items, so do not spend too long on any one of them.',
    ],
    commonMistakes: [
      'Selecting every option that sounds related to the topic, which triggers the penalty.',
      'Missing a correct option because you were still thinking about an earlier one.',
      'Choosing only one answer when the question asks for all the correct options.',
    ],
  },
  {
    taskType: 'listening-fill-blanks',
    summary:
      'Listening: Fill in the Blanks asks you to listen and type the missing word in each gap of a transcript. It feeds listening; in PTE Academic it is about 3% of the overall score and about 8% of Listening.',
    tips: [
      'Read the transcript before the audio starts, and predict the word type for each gap: noun, verb, adjective or number.',
      'Use the grammar around each gap to predict the form you need: a plural, a past tense or an article.',
      'Type the exact word you hear. Spelling matters, so check common endings such as -s, -ed and -ing.',
      'If you miss a word, move on and catch the next gap. Losing your place costs more than one missed word.',
      'Listen for small words such as "of", "to" or "and", which are quick in speech and easy to miss.',
      'Use your final minute to check the spelling of names, plurals and words that sound alike.',
    ],
    commonMistakes: [
      'Typing a word that makes sense but is not what the speaker actually said.',
      'Misspelling a word the speaker said clearly.',
      'Leaving a gap empty. A best guess is better than no answer.',
    ],
  },
  {
    taskType: 'highlight-correct-summary',
    summary:
      'Highlight Correct Summary asks you to listen to a recording and choose the paragraph that best summarises it. It feeds listening and reading; in PTE Academic it is under 1% of the overall score, with about 2% of Listening and 3% of Reading.',
    tips: [
      'Before the audio starts, read the options and note the key difference between them, such as cause and effect or a rise and a fall.',
      'Listen for the main message rather than every detail. The correct summary captures the whole recording.',
      'Eliminate options that include a detail the speaker did not mention, or that reverse the main point.',
      'Watch for extreme words such as "always", "never" or "all", which often make a summary too strong.',
      'Compare your two strongest options against the recording’s conclusion, which is often the clearest guide.',
      'Make a single decision and move on. Spending too long between two close options rarely helps.',
    ],
    commonMistakes: [
      'Choosing a summary that repeats a detail from the recording but misses the main point.',
      'Being misled by a paragraph that uses many of the same words as the recording.',
      'Overthinking close options instead of choosing the one that fits the whole recording best.',
    ],
  },
  {
    taskType: 'listening-mcsa',
    summary:
      'Listening: Multiple Choice, Single Answer asks you to listen and select the one correct answer. It feeds listening; in PTE Academic it is under 1% of the overall score and about 2% of Listening.',
    tips: [
      'Read the question and options before the audio starts so you know what to listen for.',
      'Listen for the answer to the question itself, not the first option that sounds familiar.',
      'Expect distractors: options that repeat a word from the audio but answer a different question.',
      'Track the speaker’s opinion or purpose, which often becomes clear in the final sentences.',
      'Eliminate the options you know are wrong, then decide between the rest.',
      'If you are stuck, make your best choice and move on, so one question does not cost you the next.',
    ],
    commonMistakes: [
      'Choosing an option because it repeats a word from the audio, even when its meaning differs.',
      'Losing focus in the middle of the recording and missing the key detail.',
      'Spending too long on one question and rushing the rest.',
    ],
  },
  {
    taskType: 'select-missing-word',
    summary:
      'Select Missing Word asks you to choose the word or words that complete a recording which stops before the end. It feeds listening; in PTE Academic it is about 1% of the overall score.',
    tips: [
      'Follow the meaning of the sentence up to the point where the recording stops, and predict what should come next.',
      'Think about grammar and logic: the missing word must fit both the sentence structure and the meaning.',
      'Check each option against the sentence and eliminate any that are the wrong part of speech.',
      'Concentrate on the last few words before the beep. The strongest clues are usually close to the end.',
      'Practise by covering the last word of short sentences and predicting it out loud.',
      'Decide once the beep sounds, and do not spend time waiting for more audio.',
    ],
    commonMistakes: [
      'Choosing a word that is grammatically wrong for the sentence, such as the wrong verb form.',
      'Focusing on the first half of the recording instead of the end, where the answer belongs.',
      'Picking an unusual option over a common word that fits the sentence well.',
    ],
  },
  {
    taskType: 'highlight-incorrect-words',
    summary:
      'Highlight Incorrect Words asks you to read a transcript while you listen, then tap each word that differs from what the speaker says. It feeds listening and reading; in PTE Academic it is about 4% of the overall score, with about 8% of Listening and 13% of Reading.',
    tips: [
      'Read the transcript as you listen, following each phrase with your eyes while you hear it.',
      'Focus on words that change meaning, such as numbers, negatives like "not", opposites and names.',
      'Look for substituted words, where the speaker says a different word, rather than small differences in accent.',
      'Keep your place in the transcript. Scan slightly ahead so that you do not fall behind the recording.',
      'If a phrase sounds unusual, check whether the speaker said something more natural in its place.',
      'Pace yourself across the whole transcript. Rushing to finish often leads to tapping the wrong words.',
    ],
    commonMistakes: [
      'Tapping words because they are hard to spell or unfamiliar, rather than because they differ from the audio.',
      'Falling behind the audio and losing track of where the speaker is.',
      'Missing numbers and negatives, which are easy to overlook.',
    ],
  },
  {
    taskType: 'write-from-dictation',
    summary:
      'Write from Dictation asks you to listen to one sentence and type it exactly as you hear it. It feeds listening and writing; in PTE Academic it is about 5% of the overall score, with about 13% of Listening and 23% of Writing.',
    tips: [
      'In this app’s exam mode the audio plays only once, so type as you listen and keep up with the speaker in short chunks.',
      'Spelling counts, so check words that sound alike, such as "their", "there" and "they’re".',
      'Include small words such as "a", "the" and "to". They are often quick in speech but still need to be typed.',
      'Follow standard written form: a capital letter at the start and a full stop at the end.',
      'Hold short chunks of meaning in your memory rather than single words, and type each chunk as soon as you have heard it.',
      'Practise daily with short dictation exercises, then check your text against the original to find your recurring spelling gaps.',
    ],
    commonMistakes: [
      'Mixing up words that sound the same, such as "there", "their" and "they’re", or "affect" and "effect".',
      'Dropping small words such as "the" or "of" because they are spoken quickly.',
      'Adding words that were not spoken, or changing the tense of a verb.',
    ],
  },
];
