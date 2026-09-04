export interface VireakBranch {
  id: string;
  nameKm: string;
  nameEn: string;
  hintKm?: string;
  hintEn?: string;
  isPopular?: boolean;
}

export interface CambodiaProvince {
  id: string;
  nameKm: string;
  nameEn: string;
  isPopular?: boolean;
  branches: VireakBranch[];
}

export const CAMBODIA_PROVINCES: CambodiaProvince[] = [
  {
    id: 'phnom_penh',
    nameKm: 'រាជធានីភ្នំពេញ',
    nameEn: 'Phnom Penh',
    isPopular: true,
    branches: [
      {
        id: 'pp_night_market',
        nameKm: 'សាខាកណ្តាល ផ្សាររាត្រី (ផ្លូវ ១០៦)',
        nameEn: 'Central Hub - Night Market (St. 106)',
        hintKm: 'ផ្លូវ ១០៦ កែងផ្លូវ ១០៨ មាត់ទន្លេ',
        hintEn: 'St. 106 corner St. 108, Riverside',
        isPopular: true,
      },
      {
        id: 'pp_olympic',
        nameKm: 'សាខាស្តាតអូឡាំពិក (ផ្លូវ ១៩៩ / ២៨៨)',
        nameEn: 'Olympic Hub (St. 199 / 288)',
        hintKm: 'ជិតពហុកីឡដ្ឋានជាតិអូឡាំពិក',
        hintEn: 'Near Olympic National Stadium',
        isPopular: true,
      },
      {
        id: 'pp_toul_kork',
        nameKm: 'សាខាទួលគោក (ផ្លូវ ៥៩៨ / Camko)',
        nameEn: 'Toul Kork Hub (St. 598 / Camko)',
        hintKm: 'ផ្លូវ ៥៩៨ សង្កាត់បឹងកក់ ២',
        hintEn: 'St. 598, Boeung Kak 2',
        isPopular: true,
      },
      {
        id: 'pp_sen_sok',
        nameKm: 'សាខាសែនសុខ (ជិតផ្សារទំនើបអ៊ីអន ២)',
        nameEn: 'Sen Sok Hub (Near Aeon Mall 2)',
        hintKm: 'ផ្លូវ ១០០៣ សង្កាត់ភ្នំពេញថ្មី',
        hintEn: 'St. 1003, Phnom Penh Thmey',
        isPopular: true,
      },
      {
        id: 'pp_chbar_ampov',
        nameKm: 'សាខាច្បារអំពៅ (ផ្លូវជាតិលេខ ១)',
        nameEn: 'Chbar Ampov Hub (National Road 1)',
        hintKm: 'ផ្លូវជាតិលេខ ១ ជិតស្ពានព្រះមុនីវង្ស',
        hintEn: 'NR 1 near Monivong Bridge',
        isPopular: true,
      },
      {
        id: 'pp_chom_chao',
        nameKm: 'សាខាចោមចៅ / វេងស្រេង (រង្វង់មូលចោមចៅ)',
        nameEn: 'Chom Chao / Veng Sreng Hub',
        hintKm: 'ជិតរង្វង់មូលចោមចៅ ផ្លូវវេងស្រេង',
        hintEn: 'Near Chom Chao Roundabout',
        isPopular: true,
      },
      {
        id: 'pp_bkk',
        nameKm: 'សាខាបឹងកេងកង BKK (ផ្លូវ ៣១០)',
        nameEn: 'Boeung Keng Kang Hub (St. 310)',
        hintKm: 'សង្កាត់បឹងកេងកង ១',
        hintEn: 'BKK1, Khan Chamkarmon',
      },
      {
        id: 'pp_russey_keo',
        nameKm: 'សាខាឫស្សីកែវ គីឡូម៉ែត្រ ៦ (ផ្លូវជាតិលេខ ៥)',
        nameEn: 'Russey Keo Hub - Km 6 (NR 5)',
        hintKm: 'ផ្លូវជាតិលេខ ៥ គីឡូម៉ែត្រលេខ ៦',
        hintEn: 'National Road 5, Km 6',
      },
      {
        id: 'pp_pochentong',
        nameKm: 'សាខាពោធិ៍ចិនតុង (មហាវិថីសហព័ន្ធរុស្ស៊ី)',
        nameEn: 'Pochentong Airport Hub (Russian Blvd)',
        hintKm: 'ទល់មុខព្រលានយន្តហោះអន្តរជាតិភ្នំពេញ',
        hintEn: 'Opposite Phnom Penh Airport',
      },
      {
        id: 'pp_chak_angre',
        nameKm: 'សាខាចាក់អង្រែក្រោម (ផ្លូវជាតិលេខ ២)',
        nameEn: 'Chak Angre Krom Hub (NR 2)',
        hintKm: 'ផ្លូវជាតិលេខ ២ ខណ្ឌមានជ័យ',
        hintEn: 'National Road 2, Meanchey',
      },
      {
        id: 'pp_chamkar_doung',
        nameKm: 'សាខាចំការដូង / ដង្កោ (ផ្លូវ ២១៧)',
        nameEn: 'Chamkar Doung Hub (St. 217)',
        hintKm: 'ផ្លូវ ២១៧ សង្កាត់ដង្កោ',
        hintEn: 'St. 217, Dangkao',
      },
      {
        id: 'pp_chroy_changvar',
        nameKm: 'សាខាជ្រោយចង្វារ (ផ្លូវជាតិលេខ ៦A)',
        nameEn: 'Chroy Changvar Hub (NR 6A)',
        hintKm: 'ផ្លូវជាតិលេខ ៦A ជិតស្ពានជ្រោយចង្វារ',
        hintEn: 'NR 6A near Chroy Changvar Bridge',
      },
      {
        id: 'pp_other',
        nameKm: 'សាខាផ្សេងទៀតក្នុងភ្នំពេញ (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus in Phnom Penh (Specify below)',
      },
    ],
  },
  {
    id: 'siem_reap',
    nameKm: 'ខេត្តសៀមរាប',
    nameEn: 'Siem Reap',
    isPopular: true,
    branches: [
      {
        id: 'sr_sivutha',
        nameKm: 'សាខាក្រុងសៀមរាប កណ្តាល (មហាវិថីស៊ីវុត្ថា)',
        nameEn: 'Siem Reap Downtown Hub (Sivutha Blvd)',
        hintKm: 'មហាវិថីស៊ីវុត្ថា មជ្ឈមណ្ឌលក្រុងសៀមរាប',
        hintEn: 'Sivutha Blvd, Central Town',
        isPopular: true,
      },
      {
        id: 'sr_phsar_leu',
        nameKm: 'សាខាផ្សារលើធំថ្មី (ផ្លូវជាតិលេខ ៦)',
        nameEn: 'Phsar Leu Thom Thmey Hub (NR 6)',
        hintKm: 'ផ្លូវជាតិលេខ ៦ ខាងកើតផ្សារលើ',
        hintEn: 'National Road 6, East of Phsar Leu',
        isPopular: true,
      },
      {
        id: 'sr_old_market',
        nameKm: 'សាខាផ្សារចាស់ / មាត់ស្ទឹងសៀមរាប',
        nameEn: 'Old Market / Riverside Hub',
        hintKm: 'ជិតផ្សារចាស់ និងផាប់ស្ទ្រីត',
        hintEn: 'Near Old Market & Pub Street',
      },
      {
        id: 'sr_other',
        nameKm: 'សាខាផ្សេងទៀតក្នុងសៀមរាប (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Siem Reap Campus (Specify below)',
      },
    ],
  },
  {
    id: 'battambang',
    nameKm: 'ខេត្តបាត់ដំបង',
    nameEn: 'Battambang',
    isPopular: true,
    branches: [
      {
        id: 'bb_central',
        nameKm: 'សាខាក្រុងបាត់ដំបង កណ្តាល (ផ្លូវលេខ ១)',
        nameEn: 'Battambang Central Hub (St. 1)',
        hintKm: 'ជិតរូបសំណាកលោកតាដំបងក្រញូង',
        hintEn: 'Downtown near Lok Ta Dambong Kra Nhoung',
        isPopular: true,
      },
      {
        id: 'bb_phsar_nat',
        nameKm: 'សាខាផ្សារណាត់ (ផ្លូវលេខ ២)',
        nameEn: 'Phsar Nat Hub (St. 2)',
        hintKm: 'ជិតផ្សារធំផ្សារណាត់ បាត់ដំបង',
        hintEn: 'Near Phsar Nat Central Market',
      },
      {
        id: 'bb_other',
        nameKm: 'សាខាផ្សេងទៀតក្នុងបាត់ដំបង (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Battambang Campus (Specify below)',
      },
    ],
  },
  {
    id: 'sihanoukville',
    nameKm: 'ខេត្តព្រះសីហនុ',
    nameEn: 'Sihanoukville',
    isPopular: true,
    branches: [
      {
        id: 'shv_ekareach',
        nameKm: 'សាខាក្រុងព្រះសីហនុ (វិថីឯករាជ្យ)',
        nameEn: 'Sihanoukville Downtown Hub (Ekareach St)',
        hintKm: 'វិថីឯករាជ្យ មជ្ឈមណ្ឌលក្រុងព្រះសីហនុ',
        hintEn: 'Ekareach Street, Downtown',
        isPopular: true,
      },
      {
        id: 'shv_phsar_leu',
        nameKm: 'សាខាផ្សារលើ ព្រះសីហនុ',
        nameEn: 'Phsar Leu Sihanoukville Hub',
        hintKm: 'ជិតផ្សារលើ ក្រុងព្រះសីហនុ',
        hintEn: 'Near Phsar Leu Market',
      },
      {
        id: 'shv_other',
        nameKm: 'សាខាផ្សេងទៀតក្នុងព្រះសីហនុ (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Sihanoukville Campus (Specify below)',
      },
    ],
  },
  {
    id: 'kampot',
    nameKm: 'ខេត្តកំពត',
    nameEn: 'Kampot',
    isPopular: true,
    branches: [
      {
        id: 'kp_central',
        nameKm: 'សាខាក្រុងកំពត (ជិតរង្វង់មូលធូរេន / ផ្សារសាមគ្គី)',
        nameEn: 'Kampot Central Hub (Near Durian Roundabout)',
        hintKm: 'មជ្ឈមណ្ឌលក្រុងកំពត ជិតផ្សារសាមគ្គី',
        hintEn: 'Central Kampot, near Samaki Market',
        isPopular: true,
      },
      {
        id: 'kp_other',
        nameKm: 'សាខាផ្សេងទៀតក្នុងកំពត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Kampot Campus (Specify below)',
      },
    ],
  },
  {
    id: 'banteay_meanchey',
    nameKm: 'ខេត្តបន្ទាយមានជ័យ / ប៉ោយប៉ែត',
    nameEn: 'Banteay Meanchey / Poipet',
    isPopular: true,
    branches: [
      {
        id: 'bmc_poipet',
        nameKm: 'សាខាក្រុងប៉ោយប៉ែត (ផ្លូវជាតិលេខ ៥ ជិតច្រកទ្វារព្រំដែន)',
        nameEn: 'Poipet Border Hub (NR 5 near border)',
        hintKm: 'ផ្លូវជាតិលេខ ៥ ក្រុងប៉ោយប៉ែត',
        hintEn: 'National Road 5, Poipet',
        isPopular: true,
      },
      {
        id: 'bmc_sisophon',
        nameKm: 'សាខាក្រុងសិរីសោភ័ណ (ជិតរង្វង់មូលស្រីគ្រប់លក្ខណ៍)',
        nameEn: 'Sisophon Town Hub (Central)',
        hintKm: 'ក្រុងសិរីសោភ័ណ បន្ទាយមានជ័យ',
        hintEn: 'Sisophon City Center',
        isPopular: true,
      },
      {
        id: 'bmc_other',
        nameKm: 'សាខាផ្សេងទៀតក្នុងបន្ទាយមានជ័យ (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'kampong_cham',
    nameKm: 'ខេត្តកំពង់ចាម',
    nameEn: 'Kampong Cham',
    isPopular: true,
    branches: [
      {
        id: 'kc_central',
        nameKm: 'សាខាក្រុងកំពង់ចាម (មាត់ទន្លេ / ជិតស្ពានគីហ្សូណា)',
        nameEn: 'Kampong Cham Riverside Hub (Near Kizuna Bridge)',
        hintKm: 'វិថីមាត់ទន្លេ ក្រុងកំពង់ចាម',
        hintEn: 'Riverside, near Kizuna Bridge',
        isPopular: true,
      },
      {
        id: 'kc_other',
        nameKm: 'សាខាផ្សេងទៀតក្នុងកំពង់ចាម (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Kampong Cham Campus (Specify below)',
      },
    ],
  },
  {
    id: 'tboung_khmum',
    nameKm: 'ខេត្តត្បូងឃ្មុំ (ក្រុងសួង)',
    nameEn: 'Tboung Khmum (Suong City)',
    branches: [
      {
        id: 'tk_suong',
        nameKm: 'សាខាក្រុងសួង (ផ្លូវជាតិលេខ ៧)',
        nameEn: 'Suong City Hub (National Road 7)',
        hintKm: 'ផ្លូវជាតិលេខ ៧ ជិតផ្សារសួង',
        hintEn: 'National Road 7, near Suong Market',
      },
      {
        id: 'tk_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'kandal',
    nameKm: 'ខេត្តកណ្តាល (តាខ្មៅ)',
    nameEn: 'Kandal (Ta Khmau)',
    branches: [
      {
        id: 'kd_takhmau',
        nameKm: 'សាខាក្រុងតាខ្មៅ (ផ្លូវជាតិលេខ ២១)',
        nameEn: 'Ta Khmau Town Hub (NR 21)',
        hintKm: 'ក្រុងតាខ្មៅ ជិតរង្វង់មូលព្រាបស',
        hintEn: 'Ta Khmau Town, near White Dove',
      },
      {
        id: 'kd_other',
        nameKm: 'សាខាផ្សេងទៀតក្នុងកណ្តាល (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Kandal Campus (Specify below)',
      },
    ],
  },
  {
    id: 'kampong_thom',
    nameKm: 'ខេត្តកំពង់ធំ',
    nameEn: 'Kampong Thom',
    branches: [
      {
        id: 'kt_central',
        nameKm: 'សាខាក្រុងស្ទឹងសែន (ផ្លូវជាតិលេខ ៦)',
        nameEn: 'Steung Saen Town Hub (NR 6)',
        hintKm: 'ផ្លូវជាតិលេខ ៦ ជិតស្ពានស្ទឹងសែន',
        hintEn: 'National Road 6, Kampong Thom',
      },
      {
        id: 'kt_other',
        nameKm: 'សាខាផ្សេងទៀតក្នុងកំពង់ធំ (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'kampong_chhnang',
    nameKm: 'ខេត្តកំពង់ឆ្នាំង',
    nameEn: 'Kampong Chhnang',
    branches: [
      {
        id: 'kch_central',
        nameKm: 'សាខាក្រុងកំពង់ឆ្នាំង (ផ្លូវជាតិលេខ ៥)',
        nameEn: 'Kampong Chhnang Town Hub (NR 5)',
        hintKm: 'ផ្លូវជាតិលេខ ៥ ជិតផ្សារលើកំពង់ឆ្នាំង',
        hintEn: 'National Road 5, Town Center',
      },
      {
        id: 'kch_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'pursat',
    nameKm: 'ខេត្តពោធិ៍សាត់',
    nameEn: 'Pursat',
    branches: [
      {
        id: 'ps_central',
        nameKm: 'សាខាក្រុងពោធិ៍សាត់ (ផ្លូវជាតិលេខ ៥)',
        nameEn: 'Pursat Town Hub (National Road 5)',
        hintKm: 'ផ្លូវជាតិលេខ ៥ ជិតស្ពានថ្មពោធិ៍សាត់',
        hintEn: 'National Road 5, Pursat City',
      },
      {
        id: 'ps_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'koh_kong',
    nameKm: 'ខេត្តកោះកុង',
    nameEn: 'Koh Kong',
    branches: [
      {
        id: 'kk_khemara',
        nameKm: 'សាខាក្រុងខេមរភូមិន្ទ (ជិតច្រកទ្វារអន្តរជាតិចាំយាម)',
        nameEn: 'Khemara Phoumin Hub (Koh Kong City)',
        hintKm: 'ក្រុងខេមរភូមិន្ទ ខេត្តកោះកុង',
        hintEn: 'Downtown Koh Kong City',
      },
      {
        id: 'kk_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'takeo',
    nameKm: 'ខេត្តតាកែវ',
    nameEn: 'Takeo',
    branches: [
      {
        id: 'tk_dounkeo',
        nameKm: 'សាខាក្រុងដូនកែវ (ផ្លូវជាតិលេខ ២)',
        nameEn: 'Doun Keo Town Hub (NR 2)',
        hintKm: 'ក្រុងដូនកែវ ជិតផ្សារធំតាកែវ',
        hintEn: 'Doun Keo City Center',
      },
      {
        id: 'tk_ang_tasaom',
        nameKm: 'សាខាផ្សារអង្គតាសោម (ផ្លូវជាតិលេខ ៣)',
        nameEn: 'Ang Ta Saom Hub (NR 3)',
        hintKm: 'ផ្សារអង្គតាសោម ស្រុកត្រាំកក់',
        hintEn: 'Ang Ta Saom Market',
      },
      {
        id: 'tk_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'prey_veng',
    nameKm: 'ខេត្តព្រៃវែង',
    nameEn: 'Prey Veng',
    branches: [
      {
        id: 'pv_central',
        nameKm: 'សាខាក្រុងព្រៃវែង (ផ្លូវជាតិលេខ ១១)',
        nameEn: 'Prey Veng Town Hub (NR 11)',
        hintKm: 'ក្រុងព្រៃវែង ជិតផ្សារធំ',
        hintEn: 'Prey Veng City Center',
      },
      {
        id: 'pv_neak_loeung',
        nameKm: 'សាខាអ្នកលឿង (ជិតស្ពានត្សឹបាសា/អ្នកលឿង)',
        nameEn: 'Neak Loeung Hub (NR 1)',
        hintKm: 'អ្នកលឿង ផ្លូវជាតិលេខ ១',
        hintEn: 'Neak Loeung Bridge Area',
      },
      {
        id: 'pv_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'svay_rieng',
    nameKm: 'ខេត្តស្វាយរៀង / បាវិត',
    nameEn: 'Svay Rieng / Bavet',
    branches: [
      {
        id: 'sr_town',
        nameKm: 'សាខាក្រុងស្វាយរៀង (ផ្លូវជាតិលេខ ១)',
        nameEn: 'Svay Rieng Town Hub (NR 1)',
        hintKm: 'ក្រុងស្វាយរៀង ជិតផ្សារវាលយន្ត',
        hintEn: 'Svay Rieng City Center',
      },
      {
        id: 'sr_bavet',
        nameKm: 'សាខាក្រុងបាវិត (ច្រកទ្វារអន្តរជាតិបាវិត ម៉ុកបាយ)',
        nameEn: 'Bavet International Border Hub',
        hintKm: 'ក្រុងបាវិត ជិតព្រំដែនវៀតណាម',
        hintEn: 'Bavet Border Crossing Area',
      },
      {
        id: 'sr_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'kampong_speu',
    nameKm: 'ខេត្តកំពង់ស្ពឺ',
    nameEn: 'Kampong Speu',
    branches: [
      {
        id: 'ks_chbar_mon',
        nameKm: 'សាខាក្រុងច្បារមន (ផ្លូវជាតិលេខ ៤)',
        nameEn: 'Chbar Mon Town Hub (NR 4)',
        hintKm: 'ក្រុងច្បារមន ជិតផ្សារកំពង់ស្ពឺ',
        hintEn: 'National Road 4, Chbar Mon',
      },
      {
        id: 'ks_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'kratie',
    nameKm: 'ខេត្តក្រចេះ',
    nameEn: 'Kratie',
    branches: [
      {
        id: 'kr_central',
        nameKm: 'សាខាក្រុងក្រចេះ (មាត់ទន្លេមេគង្គ ជិតផ្សារសាមគ្គី)',
        nameEn: 'Kratie Riverside Hub (Mekong River)',
        hintKm: 'វិថីមាត់ទន្លេ ក្រុងក្រចេះ',
        hintEn: 'Riverside, Kratie Town',
      },
      {
        id: 'kr_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'stung_treng',
    nameKm: 'ខេត្តស្ទឹងត្រែង',
    nameEn: 'Stung Treng',
    branches: [
      {
        id: 'st_central',
        nameKm: 'សាខាក្រុងស្ទឹងត្រែង (ជិតស្ពានសេកុង)',
        nameEn: 'Stung Treng Town Hub (Sekong Bridge)',
        hintKm: 'ក្រុងស្ទឹងត្រែង ជិតផ្សារសាមគ្គី',
        hintEn: 'Stung Treng City Center',
      },
      {
        id: 'st_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'ratanakiri',
    nameKm: 'ខេត្តរតនគិរី (បានលុង)',
    nameEn: 'Ratanakiri (Banlung)',
    branches: [
      {
        id: 'rtk_banlung',
        nameKm: 'សាខាក្រុងបានលុង (ជិតបឹងកន្សែង / ផ្សារបានលុង)',
        nameEn: 'Banlung Town Hub (Near Lake Kanseng)',
        hintKm: 'ក្រុងបានលុង ខេត្តរតនគិរី',
        hintEn: 'Banlung City Center',
      },
      {
        id: 'rtk_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'mondulkiri',
    nameKm: 'ខេត្តមណ្ឌលគិរី (សែនមនោរម្យ)',
    nameEn: 'Mondulkiri (Senmonorom)',
    branches: [
      {
        id: 'mdk_senmonorom',
        nameKm: 'សាខាក្រុងសែនមនោរម្យ (ជិតរង្វង់មូលគោព្រៃ)',
        nameEn: 'Senmonorom Town Hub (Kouprey Roundabout)',
        hintKm: 'ក្រុងសែនមនោរម្យ ខេត្តមណ្ឌលគិរី',
        hintEn: 'Senmonorom City Center',
      },
      {
        id: 'mdk_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'preah_vihear',
    nameKm: 'ខេត្តព្រះវិហារ (ត្បែងមានជ័យ)',
    nameEn: 'Preah Vihear (Tbeng Meanchey)',
    branches: [
      {
        id: 'pvh_tbeng_meanchey',
        nameKm: 'សាខាក្រុងត្បែងមានជ័យ',
        nameEn: 'Tbeng Meanchey Town Hub',
        hintKm: 'ក្រុងត្បែងមានជ័យ ខេត្តព្រះវិហារ',
        hintEn: 'Tbeng Meanchey City Center',
      },
      {
        id: 'pvh_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'oddar_meanchey',
    nameKm: 'ខេត្តឧត្តរមានជ័យ (សំរោង)',
    nameEn: 'Oddar Meanchey (Samraong)',
    branches: [
      {
        id: 'omc_samraong',
        nameKm: 'សាខាក្រុងសំរោង (ផ្លូវជាតិលេខ ៦៨)',
        nameEn: 'Samraong Town Hub (NR 68)',
        hintKm: 'ក្រុងសំរោង ជិតផ្សារធំសំរោង',
        hintEn: 'Samraong City Center',
      },
      {
        id: 'omc_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'pailin',
    nameKm: 'ខេត្តប៉ៃលិន',
    nameEn: 'Pailin',
    branches: [
      {
        id: 'pl_central',
        nameKm: 'សាខាក្រុងប៉ៃលិន (ផ្លូវជាតិលេខ ៥៧)',
        nameEn: 'Pailin Town Hub (National Road 57)',
        hintKm: 'ក្រុងប៉ៃលិន ជិតផ្សារប៉ៃលិន',
        hintEn: 'Pailin City Center',
      },
      {
        id: 'pl_other',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
  {
    id: 'kep',
    nameKm: 'ខេត្តកែប',
    nameEn: 'Kep',
    branches: [
      {
        id: 'kp_town',
        nameKm: 'សាខាក្រុងកែប (ជិតផ្សារក្តាម / ឆ្នេរកែប)',
        nameEn: 'Kep City Hub (Near Crab Market)',
        hintKm: 'ក្រុងកែប ជិតផ្សារក្តាម',
        hintEn: 'Kep City Center',
      },
      {
        id: 'kp_other_branch',
        nameKm: 'សាខាផ្សេងទៀត (សូមបញ្ជាក់ខាងក្រោម)',
        nameEn: 'Other Campus (Specify below)',
      },
    ],
  },
];

export const findProvinceById = (id: string): CambodiaProvince | undefined => {
  return CAMBODIA_PROVINCES.find((p) => p.id === id);
};

export const findBranchById = (provinceId: string, branchId: string): VireakBranch | undefined => {
  const prov = findProvinceById(provinceId);
  return prov?.branches.find((b) => b.id === branchId);
};
