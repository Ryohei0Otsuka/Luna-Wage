$(function () {
    // 作業ブロック追加
    $("#add-block").on("click", function () {
        const block = `
      <div class="work-block">
        <label>作業開始時間：
          <input type="time" name="start[]" step="300">
        </label>
        <label>作業終了時間：
          <input type="time" name="end[]" step="300">
        </label>
        <button type="button" class="remove-btn">削除</button>
      </div>`;
        $("#work-blocks").append(block);
    });

    // 作業ブロック削除（1つは残す）
    $(document).on("click", ".remove-btn", function () {
        if ($(".work-block").length > 1) {
            $(this).closest(".work-block").remove();
        }
    });

    // 通常分と深夜分（22:00以降）を分けて計算
    function getPayMinutes(start, end) {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        let startMin = sh * 60 + sm;
        let endMin = eh * 60 + em;

        if (endMin < startMin) endMin += 1440; // 翌日またぎ

        let normal = 0, late = 0;

        for (let i = startMin; i < endMin; i++) {
            const hour = Math.floor(i % 1440 / 60);
            if (hour >= 22) {
                late++;
            } else {
                normal++;
            }
        }

        return { normal, late };
    }

    // 計算ボタン
    $("#calc").on("click", function () {
        const starts = $('input[name="start[]"]').map((_, el) => el.value).get();
        const ends = $('input[name="end[]"]').map((_, el) => el.value).get();
        const wage = parseFloat($('input[name="wage"]').val());
        const transport = parseFloat($('input[name="transport"]').val()) || 0;
        const applyBonus = $('#late-bonus').is(':checked');

        if (starts.includes("") || ends.includes("") || isNaN(wage)) {
            $("#result").html("すべての項目を正しく入力してください。");
            return;
        }

        let normalTotal = 0;
        let lateTotal = 0;

        for (let i = 0; i < starts.length; i++) {
            const { normal, late } = getPayMinutes(starts[i], ends[i]);
            normalTotal += normal;
            lateTotal += late;
        }

        const pay =
            (normalTotal / 60) * wage +
            (lateTotal / 60) * wage * (applyBonus ? 1.25 : 1);
        const total = pay + transport;
        const totalMinutes = normalTotal + lateTotal;

        $("#result").html(`
      🕒 実働時間：${totalMinutes}分（うち22:00以降 ${lateTotal}分）<br>
      💰 在宅報酬：${pay.toFixed(0)}円<br>
      ✨ 合計（通信費など含む）：${total.toFixed(0)}円
    `);
    });

    // リセットボタン（入力欄だけクリア）
    $("#reset").on("click", function () {
        $('input[name="start[]"]').val("");
        $('input[name="end[]"]').val("");
    });
});
