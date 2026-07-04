---
layout: post

title: "UGS-1: Unicode Glyph-Variant Steganography, Version 1.1"
subtitle: "A deterministic, low-bandwidth Unicode homoglyph profile for hiding framed byte payloads in visible text"
quote: "The visible text stays readable. The code points carry the channel."
excerpt: "UGS-1 is a compact technical specification for embedding framed byte payloads in visible text by replacing selected Latin characters with visually similar Unicode homoglyphs. It defines security constraints, non-goals, Unicode handling rules, framing, validation, capacity, APIs, and detector guidance."
source: "Original Content"
source-url: ""
call-to-action: "Discuss this on Mastodon"

date: 2026-07-04 00:00:00 -0700
update: 2026-07-04 00:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
- UGS-1 embeds hidden byte payloads in visible text by swapping eligible Latin characters with visually similar Unicode homoglyphs.
- The specification is explicit that UGS-1 is not encryption, authentication, tamper protection, plausible deniability, or a robust high-bandwidth channel.
- Profile H1 defines a mandatory one-bit-per-character homoglyph table using selected Latin and Cyrillic lookalikes.
- The payload is wrapped in a deterministic binary frame with magic bytes, version, flags, length, payload bytes, and CRC-16/CCITT-FALSE.
- The specification includes Unicode handling rules, structured text warnings, capacity rules, scan mode, byte-oriented APIs, detector guidance, and implementation checklists.

description: "A technical specification for Unicode glyph-variant steganography using Latin/Cyrillic homoglyphs, framed byte payloads, CRC validation, capacity rules, scan mode, detector guidance, and Unicode security constraints."
seo-description: "UGS-1 is a Unicode glyph-variant steganography specification that hides framed byte payloads in visible text using Latin and Cyrillic homoglyphs, CRC validation, strict and scan decoding, capacity rules, byte-oriented APIs, and detector guidance."

categories:
- Computers

tags:
- unicode
- steganography
- homoglyphs
- confusables
- text encoding
- security
- specifications
- crc16

keywords:
- Unicode glyph-variant steganography
- UGS-1 specification
- homoglyph steganography
- Unicode confusables
- Cyrillic homoglyph encoding
- hidden payload in text
- CRC-16 CCITT-FALSE
- Unicode security mechanisms
- structured text warning
- steganography detector

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: /img/2026-07/UGS-1.webp
image-alt: "Technical infographic for UGS-1 Unicode Glyph-Variant Steganography, showing Latin and Cyrillic homoglyph code points, visible text, glyph-variant text, protocol layers, and hidden payload bits."
image-title: "UGS-1 Unicode Glyph-Variant Steganography"
image-description: "A dark blue technical infographic explaining UGS-1 Unicode glyph-variant steganography with Latin and Cyrillic small letter A examples, ordinary and glyph-variant text rows, visible and hidden layers, protocol markers, and encoded payload bits."
image-credits-artist: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
image_width: 1672
image_height: 941

mastodon-post-id:

---

## 1. Status and Security Notice

UGS-1 is a deterministic, low-bandwidth steganographic encoding for hiding a byte payload inside visible text by replacing selected Latin characters with visually similar Unicode characters.

UGS-1 is not encryption, authentication, or tamper protection. The CRC in this specification only detects accidental corruption. Anyone who understands the format can alter the payload and recompute the CRC.

If secrecy or tamper resistance is required, applications should encrypt and authenticate the payload before placing it in a UGS-1 frame, for example with an AEAD scheme.

UGS-1 data is fragile. Editors, messaging systems, source-control tools, spellcheckers, security gateways, LLM rewrites, transliteration tools, ASCII sanitizers, and confusable-character detectors may modify or remove the channel.

Unicode’s own security guidance discusses confusable characters and mechanisms for detecting them, so UGS-1 should be treated as a technique with security implications.

Reference: https://www.unicode.org/reports/tr39/

---

## 2. Goal

UGS-1 embeds a hidden byte payload inside visible text.

Conceptual example:

```text
Latin a      U+0061  encodes bit 0
Cyrillic а   U+0430  encodes bit 1
```

Both glyphs may appear visually similar:

```text
a
```

But they are different Unicode code points.

UGS-1 profile H1 encodes one bit per eligible visible character.

---

## 3. Non-Goals

UGS-1 does not provide:

```text
confidentiality
authentication
integrity against deliberate tampering
plausible deniability
robust survival through arbitrary text processing
high bandwidth
```

UGS-1 is intended to be simple, deterministic, testable, and easy to detect or remove when needed.

---

## 4. Terminology

**Cover text**  
The visible text before embedding.

**Carrier text**  
The visible text after embedding.

**Payload**  
The hidden message as raw bytes.

**Text payload**  
A payload interpreted as UTF-8 text.

**Eligible character**  
A code point that appears in the UGS-1 H1 homoglyph table.

**Zero variant**  
The ordinary Latin code point used to encode bit `0`.

**One variant**  
The visually similar Unicode code point used to encode bit `1`.

**Frame**  
The structured binary data embedded into the carrier text.

**Variant reset**  
The process of replacing UGS-1 one variants with their corresponding zero variants before embedding. This is UGS-specific and must not be confused with Unicode normalization.

---

## 5. Required Unicode Handling

Implementations MUST operate on Unicode scalar values or code points, not encoded bytes.

Implementations MUST NOT iterate through UTF-16 strings in a way that incorrectly splits surrogate pairs. Profile H1 only uses BMP code points, but code-point handling keeps implementations portable.

Implementations MUST NOT normalize, case-fold, transliterate, ASCII-clean, confusable-map, or sanitize the carrier text after embedding.

Unicode normalization forms such as NFC, NFD, NFKC, and NFKD do not generally fold Cyrillic homoglyphs into Latin letters. However, other security and text-processing systems may do so. The larger practical risks are transliteration, ASCII filtering, confusable-skeleton mapping, spellcheck, OCR, LLM rewriting, and security sanitization.

Implementations SHOULD test the intended transport channel before use.

Reference: https://www.unicode.org/reports/tr15/

---

## 6. Structured Text Warning

Applications SHOULD avoid embedding into syntax-sensitive regions, including:

```text
URLs
email addresses
domain names
source code
identifiers
HTML tags and attributes
Markdown syntax
JSON keys
YAML keys
CSV headers
shell commands
database queries
filenames
cryptographic material
```

For HTML, XML, Markdown, or rich-text formats, applications SHOULD embed only in visible prose text nodes, not in markup or syntax.

Replacing Latin letters with homoglyphs can preserve visual appearance while changing program behavior.

---

## 7. Profile H1: Binary Homoglyph Encoding

UGS-1 H1 encodes one bit per eligible character.

```text
bit 0 -> use the Latin zero variant
bit 1 -> use the homoglyph one variant
```

### 7.1 Mandatory Homoglyph Table

All UGS-1 H1 implementations MUST support this exact table.

| Bit 0 Latin | Code point | Bit 1 homoglyph | Code point | Bit-1 character name |
|---|---:|---|---:|---|
| `A` | U+0041 | `А` | U+0410 | Cyrillic Capital Letter A |
| `a` | U+0061 | `а` | U+0430 | Cyrillic Small Letter A |
| `B` | U+0042 | `В` | U+0412 | Cyrillic Capital Letter Ve |
| `C` | U+0043 | `С` | U+0421 | Cyrillic Capital Letter Es |
| `c` | U+0063 | `с` | U+0441 | Cyrillic Small Letter Es |
| `E` | U+0045 | `Е` | U+0415 | Cyrillic Capital Letter Ie |
| `e` | U+0065 | `е` | U+0435 | Cyrillic Small Letter Ie |
| `H` | U+0048 | `Н` | U+041D | Cyrillic Capital Letter En |
| `I` | U+0049 | `І` | U+0406 | Cyrillic Capital Letter Byelorussian-Ukrainian I |
| `i` | U+0069 | `і` | U+0456 | Cyrillic Small Letter Byelorussian-Ukrainian I |
| `J` | U+004A | `Ј` | U+0408 | Cyrillic Capital Letter Je |
| `j` | U+006A | `ј` | U+0458 | Cyrillic Small Letter Je |
| `K` | U+004B | `К` | U+041A | Cyrillic Capital Letter Ka |
| `M` | U+004D | `М` | U+041C | Cyrillic Capital Letter Em |
| `O` | U+004F | `О` | U+041E | Cyrillic Capital Letter O |
| `o` | U+006F | `о` | U+043E | Cyrillic Small Letter O |
| `P` | U+0050 | `Р` | U+0420 | Cyrillic Capital Letter Er |
| `p` | U+0070 | `р` | U+0440 | Cyrillic Small Letter Er |
| `T` | U+0054 | `Т` | U+0422 | Cyrillic Capital Letter Te |
| `X` | U+0058 | `Х` | U+0425 | Cyrillic Capital Letter Ha |
| `x` | U+0078 | `х` | U+0445 | Cyrillic Small Letter Ha |
| `y` | U+0079 | `у` | U+0443 | Cyrillic Small Letter U |

This table intentionally avoids many tempting lookalikes that are more font-dependent.

---

## 8. Frame Format

The payload is wrapped in a binary frame.

All multi-bit fields are encoded most-significant bit first.

All multi-byte integers are encoded big-endian.

### 8.1 Layout

```text
MAGIC          16 bits
VERSION         4 bits
FLAGS           4 bits
LENGTH         24 bits
PAYLOAD      8 * LENGTH bits
CRC16          16 bits
```

Total overhead:

```text
64 bits
```

Required capacity:

```text
required_bits = 64 + 8 * payload_length_in_bytes
```

### 8.2 MAGIC

Fixed value:

```text
0xAD53
```

Binary:

```text
10101101 01010011
```

### 8.3 VERSION

For this specification:

```text
0x1
```

Encoded as 4 bits:

```text
0001
```

### 8.4 FLAGS

For this specification:

```text
0x0
```

Encoded as 4 bits:

```text
0000
```

All nonzero flag values are reserved.

A decoder MUST reject frames with unknown nonzero flags unless explicitly configured to support an extension.

### 8.5 LENGTH

`LENGTH` is a 24-bit unsigned integer.

It gives the number of payload bytes.

Maximum representable payload size:

```text
16,777,215 bytes
```

Practical payload size is usually much smaller because the cover text must contain enough eligible characters.

Decoders SHOULD support a configurable maximum accepted payload size.

### 8.6 PAYLOAD

The payload is raw bytes.

For ordinary text messages, the payload MUST be UTF-8 encoded text without a byte-order mark.

### 8.7 CRC16

CRC-16/CCITT-FALSE is computed over:

```text
VERSION_FLAGS || LENGTH || PAYLOAD
```

Where:

```text
VERSION_FLAGS = one byte: high nibble VERSION, low nibble FLAGS
```

For UGS-1 v1 with flags 0:

```text
VERSION_FLAGS = 0x10
```

CRC parameters:

```text
Name:       CRC-16/CCITT-FALSE
Width:      16
Polynomial: 0x1021
Initial:    0xFFFF
RefIn:      false
RefOut:     false
XorOut:     0x0000
Output:     big-endian
```

Normative pseudocode:

```text
function crc16_ccitt_false(bytes):
    crc = 0xFFFF

    for b in bytes:
        crc = crc XOR (b << 8)

        repeat 8 times:
            if (crc AND 0x8000) != 0:
                crc = ((crc << 1) XOR 0x1021) AND 0xFFFF
            else:
                crc = (crc << 1) AND 0xFFFF

    return crc
```

---

## 9. Payload Preparation

For a text message:

```text
payload_bytes = UTF8_ENCODE(hidden_message)
```

Then construct:

```text
version_flags = 0x10
length         = 24-bit big-endian byte length
crc_input      = version_flags || length || payload_bytes
crc            = CRC16_CCITT_FALSE(crc_input)
frame_bytes    = 0xAD 0x53 || version_flags || length || payload_bytes || crc
frame_bits     = frame_bytes as bits, MSB first
```

Example hidden message:

```text
OK
```

UTF-8 payload bytes:

```text
4F 4B
```

Frame bytes:

```text
AD 53 10 00 00 02 4F 4B 9E A9
```

Frame bits:

```text
10101101 01010011 00010000 00000000 00000000
00000010 01001111 01001011 10011110 10101001
```

---

## 10. Encoder Algorithm

Input:

```text
cover_text
payload_bytes
```

Output:

```text
carrier_text
```

Algorithm:

```text
1. Build the UGS-1 frame.

2. Convert frame bytes to frame bits, MSB first.

3. Reset UGS-1 variants in the cover text:
   For every code point:
       if it is a one variant from the H1 table:
           replace it with its corresponding zero variant
       else:
           leave it unchanged

4. Count capacity:
       capacity_bits = number of code points in the reset cover text
                       that are zero variants in the H1 table

5. If capacity_bits < frame_bits.length:
       fail with INSUFFICIENT_CAPACITY

6. Initialize bit_index = 0.

7. For each code point cp in the reset cover text:

       if cp is not a zero variant in the H1 table:
           output cp
           continue

       if bit_index >= frame_bits.length:
           output cp
           continue

       bit = frame_bits[bit_index]

       if bit == 0:
           output cp

       if bit == 1:
           output corresponding one variant

       bit_index = bit_index + 1

8. Return the output text.
```

The encoder MUST NOT alter non-eligible characters except when resetting recognized one variants to their corresponding zero variants.

The encoder SHOULD reset variants before embedding so that accidental pre-existing homoglyphs do not become hidden bits.

---

## 11. Decoder Algorithm

Input:

```text
carrier_text
```

Output:

```text
payload_bytes
```

### 11.1 Bit Extraction

```text
1. Initialize bits = empty list.

2. For each code point cp in carrier_text:

       if cp is a zero variant in the H1 table:
           append bit 0 to bits

       else if cp is a one variant in the H1 table:
           append bit 1 to bits

       else:
           ignore cp
```

### 11.2 Strict Frame Decode

Strict mode assumes the frame starts at the first extracted bit.

```text
1. If bits.length < 64:
       fail with NO_FRAME

2. Read first 16 bits as MAGIC.
       If MAGIC != 0xAD53:
           fail with BAD_MAGIC

3. Read next 4 bits as VERSION.
       If VERSION != 1:
           fail with UNSUPPORTED_VERSION

4. Read next 4 bits as FLAGS.
       If FLAGS != 0:
           fail with UNSUPPORTED_FLAGS

5. Read next 24 bits as LENGTH.

6. required_bits = 64 + 8 * LENGTH

7. If required_bits > bits.length:
       fail with INCOMPLETE_FRAME

8. If LENGTH exceeds the implementation's configured maximum payload size:
       fail with PAYLOAD_TOO_LARGE

9. Read PAYLOAD as LENGTH bytes.

10. Read CRC16.

11. Recompute CRC16 over:
       VERSION_FLAGS || LENGTH || PAYLOAD

12. If computed CRC16 != stored CRC16:
       fail with BAD_CRC

13. Ignore extracted bits after the parsed frame.

14. Return PAYLOAD.
```

A stricter application MAY reject trailing one bits after the parsed frame, but that behavior is not required for UGS-1 compatibility.

If the caller expects text, decode PAYLOAD as UTF-8. If UTF-8 decoding fails, return `INVALID_UTF8`.

---

## 12. Optional Scan Mode

Strict mode is deterministic, but it fails if visible text appears before the embedded frame and that preceding text contains eligible characters.

Scan mode searches for a valid frame at any extracted-bit offset.

```text
1. Extract all bits from the carrier text.

2. For offset from 0 to bits.length - 64:

       if bits[offset : offset + 16] != MAGIC:
           continue

       Try to parse a frame beginning at offset.

       Before allocating payload storage:
           read LENGTH
           compute required_bits
           ensure required_bits <= bits.length - offset
           ensure LENGTH <= configured maximum payload size

       If version, flags, length, and CRC are valid:
           return the decoded payload and the bit offset

3. If no valid frame is found:
       fail with NO_VALID_FRAME
```

Because the frame uses both a 16-bit magic value and a 16-bit CRC, accidental false positives are unlikely in ordinary text. They are not impossible.

Applications that need stronger false-positive resistance should use a larger checksum or authenticated payload wrapper.

---

## 13. Capacity Rules

For profile H1:

```text
1 eligible character = 1 hidden bit
```

Required capacity:

```text
64 + 8 * payload_length
```

Examples:

| Payload | Payload bytes | Required eligible characters |
|---|---:|---:|
| empty payload | 0 | 64 |
| `OK` | 2 | 80 |
| `hello` | 5 | 104 |
| `meet at 9` | 9 | 136 |
| 100-byte message | 100 | 864 |

A practical encoder SHOULD report:

```text
capacity_bits
required_bits
unused_capacity_bits
max_payload_bytes
```

Where:

```text
if capacity_bits < 64:
    max_payload_bytes = 0
else:
    max_payload_bytes = floor((capacity_bits - 64) / 8)
```

---

## 14. Worked Test Vector

### 14.1 Hidden Message

```text
OK
```

### 14.2 Payload Bytes

```text
4F 4B
```

### 14.3 Full Frame Bytes

```text
AD 53 10 00 00 02 4F 4B 9E A9
```

### 14.4 Full Frame Bits

```text
10101101 01010011 00010000 00000000 00000000
00000010 01001111 01001011 10011110 10101001
```

### 14.5 Minimal Cover Text

Use 80 Latin `a` characters:

```text
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

Since `a` is an eligible character, each `a` can encode one bit.

### 14.6 Encoded Carrier as Escapes

For this test vector:

```text
bit 0 -> a        U+0061
bit 1 -> \u0430   Cyrillic small а
```

Encoded carrier, shown as escape groups:

```text
\u0430a\u0430a\u0430\u0430a\u0430
a\u0430a\u0430aa\u0430\u0430
aaa\u0430aaaa
aaaaaaaa
aaaaaaaa
aaaaaa\u0430a
a\u0430aa\u0430\u0430\u0430\u0430
a\u0430aa\u0430a\u0430\u0430
\u0430aa\u0430\u0430\u0430\u0430a
\u0430a\u0430a\u0430aa\u0430
```

A correct decoder should recover:

```text
OK
```

---

## 15. Error Codes

Implementations SHOULD expose these distinct errors:

```text
INSUFFICIENT_CAPACITY
NO_FRAME
BAD_MAGIC
UNSUPPORTED_VERSION
UNSUPPORTED_FLAGS
INCOMPLETE_FRAME
PAYLOAD_TOO_LARGE
BAD_CRC
INVALID_UTF8
NO_VALID_FRAME
```

For privacy or simplicity, user-facing applications MAY collapse these into a generic result such as:

```text
no valid hidden message found
```

---

## 16. Recommended API Shape

Implementations SHOULD expose byte-oriented primitives first:

```text
encode_bytes(cover_text, payload_bytes) -> carrier_text

decode_bytes(carrier_text, mode = "strict" | "scan") -> {
    payload_bytes,
    offset_bits optional
}

capacity(cover_text) -> {
    capacity_bits,
    max_payload_bytes
}
```

UTF-8 convenience wrappers MAY be provided:

```text
encode_text(cover_text, hidden_text) -> carrier_text

decode_text(carrier_text, mode = "strict" | "scan") -> hidden_text
```

The text wrappers MUST encode and decode payloads as UTF-8 without a byte-order mark.

---

## 17. Optional Extension: Zero-Width Profile Z1

Z1 is not part of mandatory UGS-1 H1 compatibility.

It may be useful when cover text lacks enough homoglyph-capable characters.

Unicode includes zero-width format characters such as:

```text
U+200B ZERO WIDTH SPACE
U+200C ZERO WIDTH NON-JOINER
U+200D ZERO WIDTH JOINER
```

A simple Z1 profile could be:

```text
bit 0 -> U+200B ZERO WIDTH SPACE
bit 1 -> U+200C ZERO WIDTH NON-JOINER
```

A Z1 encoder would insert one zero-width character between visible code points.

However, Z1 is often more fragile than H1 because messaging systems, editors, and security tools commonly strip invisible format characters.

Variation selectors are another possible channel, but they are also fragile and can interact with rendering behavior.

For a dependable first implementation, use H1.

References:

```text
https://www.unicode.org/charts/nameslist/n_2000.html
https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-23/
https://www.unicode.org/reports/tr37/
```

---

## 18. Detector and Sanitizer

A companion detector can reveal or remove UGS-1 data.

### 18.1 Reveal Mode

For every code point:

```text
if code point is a one variant:
    display it as [1:U+XXXX]
else if code point is a zero variant:
    display it as [0:U+XXXX]
else:
    display normally
```

Reveal mode is useful for debugging, auditing, and teaching.

### 18.2 Strip Mode

For every code point:

```text
if code point is a one variant:
    replace it with the corresponding zero variant
else:
    keep it unchanged
```

Strip mode removes the H1 hidden channel while preserving the intended Latin visible text.

This is useful defensively because mixed-script confusables are a known Unicode security concern.

Reference: https://www.unicode.org/reports/tr39/

---

## 19. Implementation Checklist

A conforming UGS-1 H1 implementation MUST:

```text
[ ] Use the mandatory H1 homoglyph table exactly.
[ ] Operate on Unicode code points.
[ ] Provide byte payload support.
[ ] Encode text payloads as UTF-8 without BOM when using text wrappers.
[ ] Build the exact frame format.
[ ] Use MAGIC = 0xAD53.
[ ] Use VERSION = 1.
[ ] Use FLAGS = 0.
[ ] Use 24-bit big-endian payload length.
[ ] Use CRC-16/CCITT-FALSE.
[ ] Encode bits MSB-first.
[ ] Encode one bit per eligible character.
[ ] Reset recognized one variants before embedding.
[ ] Reject bad magic.
[ ] Reject unsupported version.
[ ] Reject unsupported flags.
[ ] Reject incomplete frames.
[ ] Reject oversized payloads according to implementation limits.
[ ] Reject bad CRC.
[ ] Avoid post-encoding normalization, transliteration, or sanitization.
```

A robust implementation SHOULD also:

```text
[ ] Provide scan mode.
[ ] Provide reveal mode.
[ ] Provide strip mode.
[ ] Report capacity before encoding.
[ ] Avoid syntax-sensitive regions in structured text.
[ ] Support a configurable maximum decode payload size.
[ ] Clearly state that CRC16 is not authentication.
```

---

## 20. References

```text
Unicode Security Mechanisms
https://www.unicode.org/reports/tr39/

Unicode Normalization Forms
https://www.unicode.org/reports/tr15/

General Punctuation
https://www.unicode.org/charts/nameslist/n_2000.html

Unicode Core Specification, Special Areas and Format Characters
https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-23/

Unicode Ideographic Variation Database
https://www.unicode.org/reports/tr37/
```
