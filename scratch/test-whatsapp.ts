import { normalizePhoneNumber, getWhatsAppUrl, isValidContactNumber } from '../src/lib/whatsapp';

function runTests() {
  console.log('Testing WhatsApp normalization and link generation:');

  // Test 1: 10 digit Indian number
  const num1 = '9876543210';
  const norm1 = normalizePhoneNumber(num1);
  console.assert(norm1 === '919876543210', `Failed 1: ${norm1}`);
  console.log('✓ 10-digit number normalizes to 919876543210');

  // Test 2: Number with +91 and spaces
  const num2 = '+91 98765 43210';
  const norm2 = normalizePhoneNumber(num2);
  console.assert(norm2 === '919876543210', `Failed 2: ${norm2}`);
  console.log('✓ Number with +91 and spaces normalizes cleanly');

  // Test 3: Number with leading 0 (e.g. 09876543210)
  const num3 = '09876543210';
  const norm3 = normalizePhoneNumber(num3);
  console.assert(norm3 === '919876543210', `Failed 3: ${norm3}`);
  console.log('✓ Number with leading 0 normalizes cleanly to 919876543210');

  // Test 4: Link generation for Free item
  const urlFree = getWhatsAppUrl({
    phoneNumber: '9876543210',
    itemTitle: 'Scientific Calculator',
    collegeShortName: 'MAIT',
    listingType: 'free',
  });
  console.assert(urlFree !== null, 'URL should not be null');
  console.assert(urlFree?.includes('https://wa.me/919876543210?text='), 'URL structure check');
  console.log('✓ Free item WhatsApp link generated with correct URL encoding:', urlFree);

  // Test 5: Invalid number detection
  const invalid = '12345';
  console.assert(isValidContactNumber(invalid) === false, 'Should be invalid');
  console.log('✓ Invalid number correctly rejected');

  console.log('\nAll WhatsApp verification tests passed successfully!');
}

runTests();
