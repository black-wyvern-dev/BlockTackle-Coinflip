export default function Initial() {
  return (
    <div className="miscstats_section">
      <div className="table_box">
        <div className="modal_content" style={{ padding: '10px 0px' }}>
          <div>
            <h2 className="" style={{ color: 'white', marginBottom: '1rem' }}>
              HOW TO PLAY
            </h2>
            <h5 className="faq_answer">
              1. Connect your wallet
              <br />
              2. Ensure you have enough in your balance
              <br />
              3. Select the amount you want to play
              <br />
              4. Pick if you think Kickflip or Wipeout will win
            </h5>
            <h5 className="faq_answer" style={{ marginTop: 12, fontWeight: 400 }}>
              Choose correctly and win!
            </h5>
            <h5 className="faq_answer" style={{ marginTop: 36 }}>
              Program: 7ttfENVhNwb21KjZiLHgXLsX2sC1rKoJgnTVL4wb54t1
            </h5>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div className="modal_divider" />
            <h3 className="faq_question" style={{ marginTop: '1rem' }}>
              PLEASE KICK-FLIP RESPONSIBLY!
            </h3>
            <h5 className="faq_answer">{`All plays can be checked on-chain through \
            our program address above or by tracking our kickflip wallet.`}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
