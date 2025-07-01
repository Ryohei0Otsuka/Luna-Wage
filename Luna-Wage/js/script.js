$(function () {
    // 作業ブロック追加
    $('#add-block').on('click', function () {
        const block = `
      <div class="work-block">
        <label>作業開始時間：<input type="time" name="start[]"></label>
        <label>作業終了時間：<input type="time" name="end[]"></label>
        <button type="button" class="remove-btn">削除</button>
      </div>`;
        $('#work-blocks').append(block);
    });

    // ブロック削除（1つは残す）
    $(document).on('click', '.remove-btn', function () {
        if ($('.work-block').length > 1) {
            $(this).closest('.work-block').remove();
        }
    });

    // 時間を分に変換し、24:00をまたぐ場合に対応
    function getMinutes(start, end) {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const startMin = sh * 60 + sm;
        let endMin = eh * 60 + em;
        if (endMin < startMin) {
            // 日付をまたぐとみなして24時間加算
            endMin += 24 * 60;
        }
        return endMin - startMin;
    }

    // 計算処理
    $('#calc').on('click', function () {
        const starts = $('input[name="start[]"]').map((_, el) => el.value).get();
        const ends = $('input[name="end[]"]').map((_, el) => el.value).get();
        const wage = parseFloat($('input[name="wage"]').val());
        const transport = parseFloat($('input[name="transport"]').val()) || 0;

        if (starts.includes('') || ends.includes('') || isNaN(wage)) {
            $('#result').html('すべての項目を正しく入力してください。');
            return;
        }

        let totalMinutes = 0;

        for (let i = 0; i < starts.length; i++) {
            totalMinutes += getMinutes(starts[i], ends[i]);
        }

        if (totalMinutes <= 0) {
            $('#result').html('作業時間が正しくありません。');
            return;
        }

        const pay = (totalMinutes / 60) * wage;
        const total = pay + transport;

        $('#result').html(`
      🕒 実働時間：${totalMinutes}分<br>
      💰 在宅報酬：${pay.toFixed(0)}円<br>
      ✨ 合計（通信費など含む）：${total.toFixed(0)}円
    `);
    });
});
