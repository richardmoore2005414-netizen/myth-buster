/**
 * 「似是而非」題庫
 * ----------------
 * 格式說明：
 * {
 *   id: "CH001",
 *   category: "動物 / 人體 / 食物 / 太空 / 日常",
 *   statement: "10–20 字精簡陳述",
 *   isTrue: true | false,
 *   // 僅 isTrue === false 時需要：
 *   advancedQuestion: "那麼實際真相是什麼？",
 *   options: ["選項A", "選項B", "選項C", "選項D"],
 *   correct: 0,          // 0-based
 *   // 共用
 *   explanation: "詳細解釋",
 *   funFact: "趣味知識"
 * }
 *
 * 之後可用 Gemini Pro 大量擴充此陣列。
 */

const QUESTIONS = [
  // ===== False 題（完整兩階段）=====
  {
    id: "CH021",
    category: "食物",
    statement: "微波爐加熱食物會產生致癌輻射。",
    isTrue: false,
    advancedQuestion: "微波爐加熱食物實際上的物理原理是什麼？",
    options: [
      "利用放射性射線直接破壞微生物",
      "令食物中的水分子高頻震動摩擦生熱",
      "釋放紅外線加熱食物表面",
      "透過高壓電弧瞬間傳遞熱能"
    ],
    correct: 1,
    explanation: "微波屬於非游離輻射，能量遠低於 X 光，無法打斷分子鍵或誘發突變。原理只是帶動極性水分子震動摩擦產生熱量。",
    funFact: "微波爐的發明靈感來自工程師測試雷達磁控管時，發現口袋裡的朱古力融化了。"
  },
  {
    id: "CH023",
    category: "人體健康",
    statement: "頭髮和指甲在人死後還會繼續生長。",
    isTrue: false,
    advancedQuestion: "死後看起來「生長」的真正原因是什麼？",
    options: [
      "細胞在死後仍短暫代謝",
      "皮膚脫水收縮，讓毛髮與指甲看起來更突出",
      "屍體內部殘餘養分供應毛囊",
      "溫度變化導致角質層膨脹"
    ],
    correct: 1,
    explanation: "死後人體脫水，皮膚收縮後退，使原本埋在皮膚下的毛髮與指甲顯得更長，其實並沒有真正生長。",
    funFact: "這個迷思常見於偵探小說與電影，但法醫學早已證明它是視覺錯覺。"
  },
  {
    id: "CH024",
    category: "動物",
    statement: "鴕鳥遇到危險時會把頭埋進沙子裡。",
    isTrue: false,
    advancedQuestion: "鴕鳥真正的防禦方式是什麼？",
    options: [
      "把頭埋進沙子裝死",
      "高速奔跑並用強而有力的腿踢擊",
      "展開翅膀裝成更大的動物",
      "發出高頻聲音嚇退掠食者"
    ],
    correct: 1,
    explanation: "鴕鳥是優秀的奔跑者，極速可達約 70 km/h，並能用強健的腿部踢擊敵人。把頭埋沙是完全錯誤的迷思。",
    funFact: "這個迷思可能源於鴕鳥低頭整理巢穴或吞沙幫助消化的行為被誤解。"
  },
  {
    id: "CH025",
    category: "日常",
    statement: "金魚的記憶只有七秒鐘。",
    isTrue: false,
    advancedQuestion: "金魚實際的記憶能力大約是？",
    options: [
      "確實只有數秒",
      "至少數個月，可學習簡單任務",
      "與人類短期記憶相同",
      "完全沒有長期記憶"
    ],
    correct: 1,
    explanation: "科學研究顯示金魚能記住學習過的任務長達數月，遠超過「七秒」的都市傳說。",
    funFact: "金魚甚至能被訓練分辨不同音樂，並遊向特定聲音來源。"
  },
  {
    id: "CH026",
    category: "太空天文",
    statement: "太空中完全絕對無聲，因為沒有空氣。",
    isTrue: false,
    advancedQuestion: "為什麼說「太空完全無聲」並不完全正確？",
    options: [
      "太空中其實充滿空氣",
      "電磁波與粒子碰撞仍可產生可偵測的振動與電波",
      "太空人的耳朵能直接聽到星體聲音",
      "太陽風會製造出人類可聽的聲波"
    ],
    correct: 1,
    explanation: "傳統聲波確實需要介質，但太空中有電漿波動、粒子碰撞等現象，儀器可記錄到「聲音」轉換後的訊號。",
    funFact: "NASA 曾把太陽風與行星磁場的數據轉成音頻，釋出「太空之聲」錄音。"
  },

  // ===== True 題（單階段）=====
  {
    id: "CH022",
    category: "動物",
    statement: "袋熊排出的糞便呈現正立方體形狀。",
    isTrue: true,
    explanation: "袋熊腸道最後一段有不同彈性的收縮區，能把糞便塑成平整立方體，方便在斜坡或石頭上標示領地而不滾走。",
    funFact: "袋熊是目前已知唯一能自然排出正立方體糞便的動物。"
  },
  {
    id: "CH027",
    category: "人體健康",
    statement: "打噴嚏時眼睛會不自主地閉合。",
    isTrue: true,
    explanation: "這是反射動作，可能與保護眼睛免受噴出的微粒影響有關，幾乎無法被意識控制。",
    funFact: "有些人試圖睜眼打噴嚏，但大多數情況下反射仍會強制閉眼。"
  },
  {
    id: "CH028",
    category: "食物",
    statement: "蜂蜜在適當密封下可以存放數十年甚至更久而不壞。",
    isTrue: true,
    explanation: "蜂蜜含水量低、酸性高，加上天然抗菌物質，使細菌難以生長，考古甚至發現可食用的古代蜂蜜。",
    funFact: "埃及金字塔中曾出土三千多年前的蜂蜜，據說仍可食用。"
  },
  {
    id: "CH029",
    category: "日常",
    statement: "香蕉在植物學上屬於漿果。",
    isTrue: true,
    explanation: "植物學定義的漿果是由單一子房發育、果皮多肉的果實。香蕉、番茄、酪梨都符合此定義。",
    funFact: "草莓反而不是真正的漿果，它的種子在外面，屬於聚合果。"
  },
  {
    id: "CH030",
    category: "太空天文",
    statement: "一天之中最接近太陽的時間其實是在冬天。",
    isTrue: true,
    explanation: "地球軌道是橢圓，1 月初（北半球冬天）地球距離太陽最近（近日點），7 月初最遠。",
    funFact: "季節主要由地軸傾斜造成，而非日地距離。"
  }
];

if (typeof window !== 'undefined') {
  window.QUESTIONS = QUESTIONS;
}
