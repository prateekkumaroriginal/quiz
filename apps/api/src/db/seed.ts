import "dotenv/config";
import { inArray, sql } from "drizzle-orm";
import { closeDatabase, db } from "./client.js";
import { choicesTable, questionsTable } from "./schema.js";

type Category = "science" | "history" | "geography";
type Difficulty = "easy" | "medium" | "hard";
type Row = [Category, Difficulty, string, string, string, string, string, number];

// Format: category, difficulty, prompt, choice 1, choice 2, choice 3, choice 4, correct index.
const rows: Row[] = [
  ["science","easy","Red Planet?","Venus","Mars","Jupiter","Mercury",1], ["science","easy","Gas absorbed by plants?","Oxygen","Nitrogen","Carbon dioxide","Hydrogen",2], ["science","easy","Water boils at sea level?","50°C","75°C","100°C","150°C",2], ["science","easy","Organ that pumps blood?","Lung","Heart","Liver","Kidney",1], ["science","easy","Force pulling objects to Earth?","Friction","Magnetism","Gravity","Buoyancy",2], ["science","easy","H2O is?","Salt","Water","Oxygen","Peroxide",1], ["science","easy","Plant part absorbing water?","Flower","Root","Fruit","Leaf",1], ["science","easy","Adult insect legs?","Four","Six","Eight","Ten",1], ["science","easy","Organ detecting sound?","Eye","Skin","Ear","Tongue",2], ["science","easy","Center of an atom?","Electron","Nucleus","Ion","Shell",1], ["science","easy","Sunlight helps skin make?","Vitamin A","Vitamin B12","Vitamin C","Vitamin D",3], ["science","easy","Largest human organ?","Heart","Skin","Liver","Brain",1], ["science","medium","Cells fighting infection?","Red cells","White cells","Platelets","Plasma",1], ["science","medium","Symbol for gold?","Gd","Go","Au","Ag",2], ["science","medium","Liquid changing to gas?","Condensation","Freezing","Evaporation","Melting",2], ["science","medium","Energy stored in food?","Chemical","Sound","Nuclear","Light",0], ["science","medium","Planet with prominent rings?","Earth","Saturn","Neptune","Mars",1], ["science","medium","Basic unit of life?","Tissue","Organ","Cell","Atom",2], ["science","medium","Instrument measuring temperature?","Barometer","Thermometer","Hygrometer","Ammeter",1], ["science","medium","Rock from cooled magma?","Sedimentary","Metamorphic","Igneous","Fossil",2], ["science","medium","Metal liquid at room temperature?","Iron","Mercury","Copper","Aluminum",1], ["science","medium","Nearest star to Earth?","Sirius","Polaris","Sun","Proxima",2], ["science","medium","Molecule carrying genetic instructions?","ATP","DNA","Glucose","Hemoglobin",1], ["science","medium","Barometer measures?","Wind speed","Air pressure","Rainfall","Humidity",1], ["science","hard","SI unit of resistance?","Volt","Watt","Ohm","Ampere",2], ["science","hard","Negative particle?","Proton","Neutron","Electron","Photon",2], ["science","hard","Neutral pH at 25°C?","0","5","7","14",2], ["science","hard","Energy cannot be created or destroyed: ","Newton law","Conservation law","Ohm law","Boyle law",1], ["science","hard","Mitochondria mainly produce?","Proteins","Energy","Cells","Waste",1], ["science","hard","Highest-frequency EM wave?","Radio","Infrared","Visible","Gamma",3], ["science","hard","Speed of light approx.?","3,000 km/s","30,000 km/s","300,000 km/s","3m km/s",2], ["science","hard","Main atmospheric gas?","Oxygen","Carbon dioxide","Nitrogen","Argon",2], ["science","hard","Study of heredity?","Ecology","Genetics","Geology","Anatomy",1], ["science","hard","Orbiting telescope launched in 1990?","Kepler","Hubble","Chandra","Spitzer",1],
  ["history","easy","First US president?","Lincoln","Washington","Jefferson","Adams",1], ["history","easy","Pyramids at Giza built by?","Romans","Greeks","Egyptians","Mayans",2], ["history","easy","Magna Carta signed in?","France","England","Spain","Italy",1], ["history","easy","Reached the Americas in 1492?","Columbus","Magellan","da Gama","Cook",0], ["history","easy","Julius Caesar ruled which empire?","Roman","Ottoman","Mali","Aztec",0], ["history","easy","Renaissance began in?","Germany","Italy","Russia","Portugal",1], ["history","easy","Main drafter of US Declaration?","Franklin","Jefferson","Madison","Hamilton",1], ["history","easy","Event beginning in France in 1789?","French Revolution","Industrial Revolution","Reformation","Crusades",0], ["history","easy","Maid of Orléans?","Cleopatra","Joan of Arc","Curie","Catherine",1], ["history","easy","City buried by Vesuvius?","Pompeii","Athens","Carthage","Sparta",0], ["history","easy","Pilgrim ship?","Santa Maria","Mayflower","Endeavour","Beagle",1], ["history","medium","First emperor of unified China?","Qin Shi Huang","Kublai Khan","Sun Yat-sen","Confucius",0], ["history","medium","Treaty ending American Revolution?","Paris","Versailles","Tordesillas","Ghent",0], ["history","medium","Black Death disease?","Smallpox","Bubonic plague","Cholera","Influenza",1], ["history","medium","Soviet leader during WWII?","Lenin","Stalin","Gorbachev","Trotsky",1], ["history","medium","Cuneiform developed by?","Sumerians","Vikings","Incas","Phoenicians",0], ["history","medium","Berlin Wall fell in?","1961","1975","1989","1995",2], ["history","medium","First solo Atlantic woman flyer?","Earhart","Coleman","Tereshkova","Quimby",0], ["history","medium","Union versus Confederacy war?","Civil War","War of 1812","Spanish-American War","Mexican War",0], ["history","medium","India's first prime minister?","Gandhi","Nehru","Patel","Prasad",1], ["history","medium","Democracy arose in?","Athens","Persia","Egypt","Hittite lands",0], ["history","medium","Trade route linking China and Mediterranean?","Amber Road","Silk Road","Royal Road","Spice Route",1], ["history","hard","Treaty ending WWI with Germany?","Versailles","Paris","Brest-Litovsk","Vienna",0], ["history","hard","Deciphered hieroglyphs?","Carter","Champollion","Evans","Schliemann",1], ["history","hard","Meiji Restoration transformed?","China","Japan","Korea","Thailand",1], ["history","hard","Dynasty that built Forbidden City?","Tang","Ming","Han","Qing",1], ["history","hard","Carthaginian general crossing Alps?","Hannibal","Scipio","Cato","Marius",0], ["history","hard","Haitian Revolution colony?","New France","Saint-Domingue","New Netherland","Virginia",1], ["history","hard","Conference dividing Africa?","Yalta","Berlin","Potsdam","Bandung",1], ["history","hard","Last pharaoh of ancient Egypt?","Nefertiti","Cleopatra VII","Hatshepsut","Ramses II",1], ["history","hard","Protestant Reformation start?","Magna Carta","Luther's Theses","Nicaea","Great Schism",1], ["history","hard","First artificial satellite?","Apollo 1","Sputnik 1","Vostok 1","Explorer 1",1], ["history","hard","Quipu record keeping used by?","Inca","Maya","Aztec","Olmec",0],
  ["geography","easy","Largest continent?","Africa","Asia","Europe","North America",1], ["geography","easy","Longest South American river?","Nile","Amazon","Yangtze","Mississippi",1], ["geography","easy","Capital of France?","Madrid","Rome","Paris","Berlin",2], ["geography","easy","Ocean between Africa and Australia?","Atlantic","Pacific","Indian","Arctic",2], ["geography","easy","Everest mountain range?","Andes","Alps","Himalayas","Rockies",2], ["geography","easy","Boot-shaped country?","Greece","Italy","Chile","Portugal",1], ["geography","easy","Capital of Japan?","Kyoto","Seoul","Tokyo","Osaka",2], ["geography","easy","Northern African desert?","Gobi","Sahara","Atacama","Kalahari",1], ["geography","easy","Smallest continent?","Europe","Australia","Antarctica","South America",1], ["geography","easy","Cairo is capital of?","Egypt","Morocco","Sudan","Libya",0], ["geography","easy","Line dividing north and south?","Prime Meridian","Equator","Tropic of Cancer","Date Line",1], ["geography","medium","Country with most natural lakes?","Brazil","Canada","Russia","United States",1], ["geography","medium","Capital of Kenya?","Lagos","Nairobi","Kampala","Addis Ababa",1], ["geography","medium","Gibraltar connects Atlantic to?","Black Sea","Red Sea","Mediterranean","Arabian Sea",2], ["geography","medium","River through London?","Seine","Thames","Danube","Rhine",1], ["geography","medium","Largest island?","Greenland","New Guinea","Borneo","Madagascar",0], ["geography","medium","Petra is in?","Jordan","Lebanon","Syria","Israel",0], ["geography","medium","Capital of Brazil?","Rio","São Paulo","Brasília","Salvador",2], ["geography","medium","Traditional source of Nile?","Lake Victoria","Lake Baikal","Lake Titicaca","Lake Chad",0], ["geography","medium","Country enclosed by South Africa?","Eswatini","Lesotho","Botswana","Namibia",1], ["geography","medium","Deepest ocean trench?","Tonga","Mariana","Puerto Rico","Java",1], ["geography","hard","Longest international border?","Russia-China","US-Canada","Brazil-Bolivia","India-Bangladesh",1], ["geography","hard","Transylvania is in?","Hungary","Romania","Bulgaria","Serbia",1], ["geography","hard","Sea with no coastline?","Sargasso","Coral","Weddell","Bering",0], ["geography","hard","River forming much Mexico-US border?","Colorado","Rio Grande","Yukon","Missouri",1], ["geography","hard","Capital of Mongolia?","Astana","Ulaanbaatar","Tashkent","Bishkek",1], ["geography","hard","Abyssinia was former name of?","Ethiopia","Eritrea","Somalia","Ghana",0], ["geography","hard","Atacama Desert mainly in?","Peru","Chile","Argentina","Bolivia",1], ["geography","hard","River through Vienna and Budapest?","Danube","Volga","Elbe","Po",0], ["geography","hard","Southernmost continent?","Australia","South America","Antarctica","Africa",2], ["geography","hard","Most time zones including territories?","Russia","United States","France","China",2], ["geography","hard","Capital of Iceland?","Oslo","Helsinki","Reykjavík","Stockholm",2], ["geography","hard","Plate containing most Pacific Ocean?","Eurasian","Pacific","African","Nazca",1],
];

if (rows.length !== 100) throw new Error(`Expected 100 questions, got ${rows.length}`);

try {
  await db.transaction(async (tx) => {
    const questionIds = rows.map((_, index) =>
      `00000000-0000-4000-8000-${(index + 1).toString(16).padStart(12, "0")}`,
    );

    await tx
      .insert(questionsTable)
      .values(rows.map(([category, difficulty, prompt], index) => ({
        id: questionIds[index]!,
        category,
        difficulty,
        prompt,
      })))
      .onConflictDoUpdate({
        target: questionsTable.id,
        set: {
          prompt: sql`excluded.prompt`,
          category: sql`excluded.category`,
          difficulty: sql`excluded.difficulty`,
        },
      });

    await tx.delete(choicesTable).where(inArray(choicesTable.questionId, questionIds));

    await tx.insert(choicesTable).values(
      rows.flatMap(([, , , ...rest], index) => {
        const correct = rest.pop() as number;
        const choices = rest as string[];
        if (choices.length !== 4 || correct < 0 || correct > 3) {
          throw new Error(`Invalid question at ${index + 1}`);
        }
        return choices.map((text, position) => ({
          questionId: questionIds[index]!,
          position,
          text,
          isCorrect: position === correct,
        }));
      }),
    );
  });
  console.log(`Database seeded with ${rows.length} questions`);
} finally {
  await closeDatabase();
}
