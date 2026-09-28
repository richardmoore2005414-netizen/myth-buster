# 似是而非 · Myth Buster

「似是而非」速答挑戰 — True or False Myth Buster

快節奏辨識日常迷思，成功識破後再挑戰進階四選一，最高單題可拿 **+20** 分。

## 玩法摘要

| 陳述性質 | 玩家選擇 | 結果 | 分數 |
|---------|---------|------|------|
| True（驚人真相） | True | 答對 | +10 → 下一題 |
| True | False | 答錯 | -10 → 下一題 |
| False（常見迷思） | True | 誤信 | -10 → 下一題 |
| False | False | 成功識破 | +10 → **進入進階四選一** |

**進階四選一**（僅成功識破 False 時觸發）  
- 答對：再 +10（本題最高 +20）  
- 答錯或超時：+0（不扣第一階段分數）

分數最低為 0，不會負分。

## 計時

- 速答（True/False）：每題 **10 秒**，超時視同答錯（-10）
- 進階四選一：**15 秒**，超時視同放棄加分

## 檔案結構

```
index.html    — 頁面結構
style.css     — 復古牛皮紙質感主題（有紋理）
script.js     — 遊戲引擎（完全依規範實作）
questions.js  — 題庫（可直接替換 / 擴充）
```

## 題庫格式

```js
{
  id: "CH021",
  category: "食物",
  statement: "微波爐加熱食物會產生致癌輻射。",
  isTrue: false,
  advancedQuestion: "微波爐加熱食物實際上的物理原理是什麼？",
  options: ["A", "B", "C", "D"],
  correct: 1,
  explanation: "詳細解釋…",
  funFact: "趣味知識…"
}
```

True 題只需 `isTrue: true` + `explanation` + `funFact`，不需要進階欄位。

## 如何執行

直接用瀏覽器開啟 `index.html`，或：

```bash
npx serve .
```

## 授權

MIT
