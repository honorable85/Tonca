### Introduction

**Toncat** est un **Framework PHP** basé sur le model **MVC** (**M**odel **V**iew **C**ontroller).

Il ne s'agit pas de réinventer la roue, ni d'apporter une quelconque amériolation aux Frameworks existants. Mais plutôt **Toncat** se donne pour mission d'éliminer tout abstraction dans le monde du dévelppement. Laquelle est déjà entrain de gagner le terrain. Pour le simple fait que les développeur adorent plus l'esthétique du code jusqu'au point à en perdre sa valeur.

Les Frameworks sont devneus les maîtres d'orchestre et les développeurs dansent à leur rythme. La roue tourne à l'inverse, ce qui ne devrait pas être le cas ! C'est le code qui écrit le développeur ou bien c'est le développeur qui écrit le code ? Posons nous cette question.

J'ai vu des procédés de code où pour préciser la clause `where` d'une requête MySQL, le développeur est appelé à entrer un tableau associatif. Alors qu'en réalité il ne s'agit que d'une portion de chaîne de caractères à préciser. Je me demande pourquoi pas entrer en même temps cette chaîne tant que l'on connaît déjà tous les paramètres ? Comme ça on aurait même plus de possibilité !

Je me demande est-ce qu'on apprend ou on désapprend ?

Il fut un temps PHP ne pouvant pas importer une portion de code dans un code parent sans éclaser les variables globales de ce dernier. Les gens se plaignaient de cela. Et pour remédier à ça PHP a apporter une solution magique `namesapce`. Pour moi cette une grande opportunité pour améliorer la façon dont les middlewares fonctionnnent dans les Frameworks. Il fallait avoir cette possibilité d'imbliquer des middleware jusqu'à l'infini (pour ne pas exagérer :smile:).

```flow
   st=>start: Middleware 2
   op=>operation: Middleware 1
   cond=>condition: Autoriser Oui ou Non ?
   e=>end: Exécuter la route

   st->op->cond
   cond(yes)->e
```
