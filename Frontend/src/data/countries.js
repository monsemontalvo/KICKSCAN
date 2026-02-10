// src/data/countries.js

export const countriesData = [
    // --- GRUPO A ---
    {
      id: 'mexico',
      name: 'México',
      flag: '🇲🇽',
      stats: { ataque: 88, defensa: 79, velocidad: 84, habitantes: "126 M", capital: "CDMX" },
      facts: [
        "El Chichén Itzá es una de las 7 maravillas del mundo moderno.",
        "México introdujo el chocolate, el maíz y el chile al mundo.",
        "La CDMX se hunde unos 10-30 cm cada año."
      ],
      trivia: {
        pregunta: "¿Qué significa la palabra 'México'?",
        respuesta: "En el ombligo de la luna (del Náhuatl)."
      }
    },
    {
      id: 'sudafrica',
      name: 'Sudáfrica',
      flag: '🇿🇦',
      stats: { ataque: 80, defensa: 82, velocidad: 85, habitantes: "60 M", capital: "Pretoria*" },
      facts: [
        "Es el único país con 3 capitales oficiales (Pretoria, C. del Cabo, Bloemfontein).",
        "Tienen 11 idiomas oficiales reconocidos por su constitución.",
        "Aquí se realizó el primer trasplante de corazón humano exitoso en 1967."
      ],
      trivia: {
        pregunta: "¿Qué líder sudafricano ganó el Nobel de la Paz en 1993?",
        respuesta: "Nelson Mandela."
      }
    },
    {
      id: 'corea_sur',
      name: 'Corea del Sur',
      flag: '🇰🇷',
      stats: { ataque: 86, defensa: 78, velocidad: 93, habitantes: "51 M", capital: "Seúl" },
      facts: [
        "Tienen la conexión a internet promedio más rápida del mundo.",
        "Más del 20% de la población se apellida 'Kim'.",
        "Al nacer, ya se considera que tienes 1 año de edad (sistema tradicional)."
      ],
      trivia: {
        pregunta: "¿Cuál es el plato nacional hecho de col fermentada y picante?",
        respuesta: "El Kimchi."
      }
    },
    {
      id: 'japon',
      name: 'Japón',
      flag: '🇯🇵',
      stats: { ataque: 84, defensa: 88, velocidad: 85, habitantes: "125 M", capital: "Tokio" },
      facts: [
        "Tokio es el área metropolitana más poblada del mundo (37 millones).",
        "Hay más mascotas registradas que niños menores de 15 años.",
        "Cultivan sandías cuadradas para que sean más fáciles de almacenar en refrigeradores."
      ],
      trivia: {
        pregunta: "¿Cómo se llama el monte sagrado y más alto de Japón?",
        respuesta: "El Monte Fuji."
      }
    },
    {
      id: 'tunez',
      name: 'Túnez',
      flag: '🇹🇳',
      stats: { ataque: 72, defensa: 76, velocidad: 74, habitantes: "12 M", capital: "Túnez" },
      facts: [
        "Aquí se encuentran las ruinas de Cartago, la antigua rival de Roma.",
        "El desierto de Túnez fue el set de filmación para el planeta Tatooine en Star Wars.",
        "Es el punto más al norte de todo el continente africano (Cabo Angela)."
      ],
      trivia: {
        pregunta: "¿Qué general de Cartago cruzó los Alpes con elefantes?",
        respuesta: "Aníbal Barca."
      }
    },
    
    // --- GRUPO EUROPEO MIXTO ---
    {
      id: 'dinamarca',
      name: 'Dinamarca',
      flag: '🇩🇰',
      stats: { ataque: 83, defensa: 85, velocidad: 78, habitantes: "5.9 M", capital: "Copenhague" },
      facts: [
        "Tienen la bandera nacional más antigua del mundo aún en uso (Dannebrog, desde 1219).",
        "Se dice que hay más bicicletas que personas en Copenhague.",
        "Es el lugar de nacimiento de los bloques LEGO."
      ],
      trivia: {
        pregunta: "¿Qué escritor danés creó 'La Sirenita' y 'El Patito Feo'?",
        respuesta: "Hans Christian Andersen."
      }
    },
    {
        id: 'macedonia',
        name: 'Macedonia del Norte',
        flag: '🇲🇰',
        stats: { ataque: 70, defensa: 75, velocidad: 72, habitantes: "2 M", capital: "Skopje" },
        facts: [
          "El lago Ohrid es uno de los más antiguos y profundos de Europa (3 millones de años).",
          "La Madre Teresa de Calcuta nació en su capital, Skopje.",
          "Fue el único país que se separó de Yugoslavia sin derramar sangre."
        ],
        trivia: {
          pregunta: "¿Qué famoso conquistador antiguo nació en la región de Macedonia?",
          respuesta: "Alejandro Magno."
        }
    },
    {
        id: 'republica_checa',
        name: 'República Checa',
        flag: '🇨🇿',
        stats: { ataque: 82, defensa: 80, velocidad: 79, habitantes: "10.5 M", capital: "Praga" },
        facts: [
          "Tienen la mayor densidad de castillos por kilómetro cuadrado en el mundo.",
          "Inventaron los lentes de contacto suaves y la palabra 'Robot'.",
          "Son los mayores consumidores de cerveza per cápita del mundo."
        ],
        trivia: {
          pregunta: "¿Qué famoso reloj medieval se encuentra en la plaza de Praga?",
          respuesta: "El Reloj Astronómico."
        }
    },
    {
        id: 'irlanda',
        name: 'Irlanda',
        flag: '🇮🇪',
        stats: { ataque: 75, defensa: 88, velocidad: 82, habitantes: "5 M", capital: "Dublín" },
        facts: [
          "El Halloween se originó aquí como el festival celta de 'Samhain'.",
          "San Patricio no era irlandés (era romano-británico) y no expulsó serpientes (nunca hubo).",
          "Es el único país del mundo que tiene un instrumento musical (el arpa) como símbolo nacional."
        ],
        trivia: {
          pregunta: "¿En qué ciudad se construyó el Titanic?",
          respuesta: "Belfast (Irlanda del Norte, en la misma isla)."
        }
    },

    // --- GRUPO DEL ESTE ---
    {
      id: 'ucrania',
      name: 'Ucrania',
      flag: '🇺🇦',
      stats: { ataque: 81, defensa: 90, velocidad: 80, habitantes: "38 M", capital: "Kiev" },
      facts: [
        "La estación de metro 'Arsenalna' es la más profunda del mundo (105m bajo tierra).",
        "El avión más pesado del mundo (Antonov An-225 Mriya) fue construido aquí.",
        "Inventaron la lámpara de queroseno."
      ],
      trivia: {
        pregunta: "¿Qué representa el color amarillo en su bandera?",
        respuesta: "Los campos de trigo bajo el cielo azul."
      }
    },
    {
        id: 'suecia',
        name: 'Suecia',
        flag: '🇸🇪',
        stats: { ataque: 85, defensa: 84, velocidad: 83, habitantes: "10 M", capital: "Estocolmo" },
        facts: [
          "Reciclan tanto que a veces tienen que importar basura de otros países.",
          "Es el lugar de nacimiento de Minecraft, Spotify y el premio Nobel.",
          "Tienen un hotel hecho completamente de hielo que se reconstruye cada año."
        ],
        trivia: {
          pregunta: "¿Qué famoso grupo pop sueco cantó 'Dancing Queen'?",
          respuesta: "ABBA."
        }
    },
    {
        id: 'polonia',
        name: 'Polonia',
        flag: '🇵🇱',
        stats: { ataque: 89, defensa: 81, velocidad: 78, habitantes: "38 M", capital: "Varsovia" },
        facts: [
          "El Castillo de Malbork es el castillo de ladrillo más grande del mundo.",
          "Marie Curie (Premio Nobel) nació en Varsovia.",
          "Tienen el 'Bosque Torcido' donde los pinos crecen con una curva de 90 grados inexplicable."
        ],
        trivia: {
          pregunta: "¿Qué animal pesado y antiguo vive libre en el bosque de Białowieża?",
          respuesta: "El Bisonte Europeo."
        }
    },
    {
        id: 'albania',
        name: 'Albania',
        flag: '🇦🇱',
        stats: { ataque: 68, defensa: 85, velocidad: 74, habitantes: "2.8 M", capital: "Tirana" },
        facts: [
          "Tienen más de 750,000 búnkers de concreto abandonados por todo el país.",
          "Mover la cabeza de arriba a abajo significa 'No' y de lado a lado significa 'Sí' (al revés).",
          "Su idioma no se parece a ningún otro en Europa."
        ],
        trivia: {
          pregunta: "¿Qué significa el nombre nativo del país 'Shqipëria'?",
          respuesta: "Tierra de las Águilas."
        }
    },

    // --- OTROS ---
    {
      id: 'uzbekistan',
      name: 'Uzbekistán',
      flag: '🇺🇿',
      stats: { ataque: 68, defensa: 75, velocidad: 70, habitantes: "35 M", capital: "Taskent" },
      facts: [
        "Es un país 'doblemente aislado': no tiene mar y sus vecinos tampoco tienen mar.",
        "Fue el corazón de la antigua Ruta de la Seda.",
        "Tienen una de las minas de oro a cielo abierto más grandes del mundo."
      ],
      trivia: {
        pregunta: "¿Qué ciudad uzbeka es famosa por su arquitectura azul turquesa?",
        respuesta: "Samarcanda."
      }
    },
    {
      id: 'colombia',
      name: 'Colombia',
      flag: '🇨🇴',
      stats: { ataque: 87, defensa: 79, velocidad: 88, habitantes: "51 M", capital: "Bogotá" },
      facts: [
        "Es el segundo país con mayor biodiversidad del mundo.",
        "El 'Caño Cristales' es conocido como el río de los 5 colores o el arcoíris líquido.",
        "Es el mayor productor mundial de esmeraldas de alta calidad."
      ],
      trivia: {
        pregunta: "¿Qué escritor colombiano ganó el Nobel por 'Cien años de soledad'?",
        respuesta: "Gabriel García Márquez."
      }
    },
    
    // --- GRUPO ISLAS/AFRICA ---
    {
      id: 'rd_congo',
      name: 'R.D. Congo',
      flag: '🇨🇩',
      stats: { ataque: 74, defensa: 72, velocidad: 81, habitantes: "100 M", capital: "Kinshasa" },
      facts: [
        "Es el hogar de los gorilas de montaña en el Parque Virunga.",
        "Kinshasa es la segunda ciudad de habla francesa más grande del mundo (después de París).",
        "Es uno de los países más ricos en recursos naturales (cobalto, diamantes) del planeta."
      ],
      trivia: {
        pregunta: "¿Cómo se llamaba este país entre 1971 y 1997?",
        respuesta: "Zaire."
      }
    },
    {
      id: 'jamaica',
      name: 'Jamaica',
      flag: '🇯🇲',
      stats: { ataque: 76, defensa: 70, velocidad: 99, habitantes: "2.8 M", capital: "Kingston" },
      facts: [
        "Es la cuna del género musical Reggae.",
        "Tienen la mayor cantidad de iglesias por kilómetro cuadrado en el mundo.",
        "Su bandera es la única en el mundo que no tiene rojo, blanco ni azul."
      ],
      trivia: {
        pregunta: "¿Quién es el velocista jamaiquino conocido como el hombre más rápido del mundo?",
        respuesta: "Usain Bolt."
      }
    },
    {
        id: 'nueva_caledonia',
        name: 'Nueva Caledonia',
        flag: '🇳🇨',
        stats: { ataque: 65, defensa: 68, velocidad: 70, habitantes: "270 K", capital: "Numea" },
        facts: [
          "Tiene la laguna más grande del mundo (Patrimonio de la Humanidad).",
          "Contiene alrededor del 10% de las reservas mundiales de níquel.",
          "Es un territorio de ultramar de Francia, por lo que su moneda es el Franco CFP."
        ],
        trivia: {
          pregunta: "¿Qué ave nacional de la isla no puede volar y ladra como perro?",
          respuesta: "El Kagú."
        }
    },

    // --- HISPANOS ---
    {
      id: 'uruguay',
      name: 'Uruguay',
      flag: '🇺🇾',
      stats: { ataque: 85, defensa: 89, velocidad: 77, habitantes: "3.5 M", capital: "Montevideo" },
      facts: [
        "Fue el primer país en organizar (y ganar) una Copa del Mundo en 1930.",
        "Hay aproximadamente 3 o 4 vacas por cada habitante humano.",
        "Tienen el himno nacional más largo del mundo (dura unos 6 minutos)."
      ],
      trivia: {
        pregunta: "¿Qué infusión amarga es símbolo nacional y se toma con termo bajo el brazo?",
        respuesta: "El Mate."
      }
    },
    {
      id: 'espana',
      name: 'España',
      flag: '🇪🇸',
      stats: { ataque: 90, defensa: 88, velocidad: 82, habitantes: "47 M", capital: "Madrid" },
      facts: [
        "Es el país con más bares por habitante en la Unión Europea.",
        "Producen cerca del 44% del aceite de oliva de todo el mundo.",
        "El español es el segundo idioma más hablado del mundo como lengua materna."
      ],
      trivia: {
        pregunta: "¿En qué ciudad se encuentra la famosa basílica de la Sagrada Familia?",
        respuesta: "Barcelona."
      }
    }
];