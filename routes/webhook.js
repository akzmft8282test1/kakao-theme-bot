const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const utterance = req.body.userRequest.utterance;

  const themes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../themes/themes.json"))
  );

  // 1️⃣ /테마 입력 시
  if (utterance === "/테마") {
    const items = themes.map(t => ({
      title: t.name,
      description: t.description,
      imageUrl: t.image,
      link: {
        web: `https://your-render-url.onrender.com/theme?theme=${t.id}`
      }
    }));

    return res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            listCard: {
              header: {
                title: "🎨 카카오톡 테마"
              },
              items
            }
          }
        ]
      }
    });
  }

  // 2️⃣ 테마 선택 후 (theme=xxx)
  const params = req.body.action?.params;
  if (params?.theme) {
    const theme = themes.find(t => t.id === params.theme);
    if (!theme) return res.end();

    return res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: `📱 "${theme.name}" 다운로드`
            }
          }
        ],
        quickReplies: [
          {
            label: "🍎 iPhone",
            action: "webLink",
            webLinkUrl: theme.ios.url
          },
          {
            label: "🤖 Android",
            action: "webLink",
            webLinkUrl: theme.android.url
          }
        ]
      }
    });
  }

  // 기본 응답
  res.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "📌 /테마 를 입력해 테마를 확인하세요!"
          }
        }
      ]
    }
  });
};
