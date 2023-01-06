import * as $ from 'jquery';

$('#calculate-button').click(() => {
  // eslint-disable-next-line no-console
  console.debug(`Wysokość kredytu(PLN): ${$('#loan-amount').val()}`);

  // eslint-disable-next-line no-console
  console.debug(`Okres kredytowania(miesiące): ${$('#loan-period').val()}`);

  // eslint-disable-next-line no-console
  console.debug(
    `Wysokość wpłaty własnej(PLN): ${$('#amount-of-own-contribution').val()}`
  );

  // eslint-disable-next-line no-console
  console.debug(`Oprocentowanie kredytu: ${$('#loan-interest-rate').val()}`);

  // eslint-disable-next-line no-console
  console.debug(
    `Wysokość spłaty częsciowej(PLN): ${$('#partial-payment-amount').val()}`
  );
});
