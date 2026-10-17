import test from "node:test";
import assert from "node:assert/strict";

import { generateRoomId, validateRoomData } from "../utils/room.utils.js";

test("generateRoomId", async (t) => {
  await t.test("returns a 6 character string", () => {
    const roomId = generateRoomId();

    assert.equal(typeof roomId, "string");
    assert.equal(roomId.length, 6);
  });

  await t.test("uses only uppercase alphanumerics", () => {
    // The characters a player may have to read aloud or type into a join form,
    // so the set is pinned: no lowercase, no separator, no uuid remainder.
    for (let i = 0; i < 200; i += 1) {
      assert.match(generateRoomId(), /^[A-Z0-9]{6}$/);
    }
  });

  await t.test("produces distinct ids across consecutive calls", () => {
    // 6 characters drawn from [A-Z0-9] is not an infinite id space, so demanding
    // zero collisions over 1000 draws is a coin flip: the birthday bound gives
    // ~1000^2 / 2 / 36^6 ~= 0.4 expected collisions there, which flakes. Assert
    // against the bound instead, so the test fails on a broken generator (a
    // counter, a truncation, a modulo) but not on ordinary luck.
    const count = 500;
    const ids = Array.from({ length: count }, () => generateRoomId());
    const duplicates = count - new Set(ids).size;

    assert.ok(
      duplicates <= 1,
      `expected at most 1 accidental collision in ${count} draws, saw ${duplicates}`,
    );
  });
});

test("validateRoomData", async (t) => {
  const validQuiz = {
    quizname: "General Knowledge",
    questions: [
      {
        question: "What is 2 + 2?",
        options: [
          { option: "3", isAnswer: false },
          { option: "4", isAnswer: true },
        ],
      },
    ],
  };

  await t.test("returns true for a valid quiz payload", () => {
    assert.equal(validateRoomData(validQuiz), true);
  });

  await t.test("returns true without mutating the payload", () => {
    const snapshot = JSON.parse(JSON.stringify(validQuiz));

    validateRoomData(validQuiz);

    assert.deepEqual(validQuiz, snapshot);
  });

  await t.test("throws for null", () => {
    assert.throws(() => validateRoomData(null), /Invalid quiz data/);
  });

  await t.test("throws for undefined", () => {
    assert.throws(() => validateRoomData(undefined), /Invalid quiz data/);
  });

  await t.test("throws when quizname is missing", () => {
    const { quizname, ...withoutName } = validQuiz;

    assert.throws(() => validateRoomData(withoutName), /Invalid quiz data/);
  });

  await t.test("throws when quizname is an empty string", () => {
    assert.throws(
      () => validateRoomData({ ...validQuiz, quizname: "" }),
      /Invalid quiz data/,
    );
  });

  await t.test("throws when questions is missing", () => {
    const { questions, ...withoutQuestions } = validQuiz;

    assert.throws(() => validateRoomData(withoutQuestions), /Invalid quiz data/);
  });

  await t.test("passes when questions is an empty array", () => {
    // Current behaviour: presence is checked, not length. Pinned here so that a
    // later decision to reject empty quizzes is a deliberate change with a test
    // to update, rather than a silent behaviour shift.
    assert.equal(
      validateRoomData({ ...validQuiz, questions: [] }),
      true,
    );
  });

  await t.test("does not require anything beyond quizname and questions", () => {
    assert.equal(validateRoomData({ quizname: "x", questions: [{}], host: 1, id: "a" }), true);
  });
});
