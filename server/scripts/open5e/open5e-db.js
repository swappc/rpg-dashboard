
class Open5eDB {

  constructor(db) {
    this.db = db;
  }

  createTables() {
    this.db.run("DROP TABLE IF EXISTS dnd_class")
      .run("DROP TABLE IF EXISTS archetype")

      .run("CREATE TABLE dnd_class (class_id INTEGER PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL, desc TEXT NOT NULL, document_slug TEXT NOT NULL, hit_dice TEXT NOT NULL, hp_at_higher_levels TEXT NOT NULL, prof_armor TEXT NOT NULL, prof_weapons TEXT NOT NULL, prof_tools TEXT NOT NULL, prof_saving_throws TEXT NOT NULL, equipment TEXT NOT NULL, class_table TEXT NOT NULL, spellcasting_ability TEXT NOT NULL, subtypes_name TEXT NOT NULL)")
      .run("CREATE TABLE archetype (archetype_id INTEGER PRIMARY KEY, class_id INTEGER, name TEXT NOT NULL, slug TEXT NOT NULL, desc TEXT NOT NULL, document_slug TEXT NOT NULL, FOREIGN KEY(class_id) REFERENCES dnd_class(id))");
  }

  populateClasses(classes) {
    var classValues = [];
    var archeTypeValues = [];
    var classId = 1;
    var classPlaceholder = '';
    var archeTypePlaceholders = [];

    classes.forEach(item => {
      classValues.push(classId);
      classValues.push(item.name);
      classValues.push(item.slug);
      classValues.push(item.desc);
      classValues.push(item.document_slug);
      classValues.push(item.hit_dice);
      classValues.push(item.hp_at_higher_levels);
      classValues.push(item.prof_armor);
      classValues.push(item.prof_weapons);
      classValues.push(item.prof_tools);
      classValues.push(item.prof_saving_throws);
      classValues.push(item.equipment);
      classValues.push(item.table);
      classValues.push(item.spellcasting_ability);
      classValues.push(item.subtypes_name);
      if (item.archetypes) {
        item.archetypes.forEach(type => {
          archeTypeValues.push(classId);
          archeTypeValues.push(type.name);
          archeTypeValues.push(type.slug);
          archeTypeValues.push(type.desc);
          archeTypeValues.push(type.document_slug);
        });
        archeTypePlaceholders.push(item.archetypes.map(() => '(?,?,?,?,?)').join(','));
      }
      classId++;
    });
    classPlaceholder = classes.map(() => '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').join(',');
    if (classValues.length > 0) {
      this.db.serialize(() => {
        this.db.run("INSERT INTO dnd_class (class_id, name, slug, desc, document_slug, hit_dice, hp_at_higher_levels, prof_armor, prof_weapons, prof_tools, prof_saving_throws, equipment, class_table, spellcasting_ability, subtypes_name) VALUES " + classPlaceholder, classValues);
        if (archeTypeValues.length > 0) {
          var placeholder = archeTypePlaceholders.join(',');
          this.db.run("INSERT INTO archetype (class_id, name, slug, desc, document_slug) VALUES " + placeholder, archeTypeValues);
        }
      });
    }
  }
}

module.exports = Open5eDB;