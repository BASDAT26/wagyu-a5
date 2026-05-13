-- ============================================================================
-- MIGRATION: Triggers, Stored Procedures & Schema Changes
-- Project: TikTakTuk (wagyu-a5)
-- ============================================================================

SET search_path TO TIKTAKTUK;

-- ─── 1. Tambah kolom status di tabel TICKET ─────────────────────────────────

ALTER TABLE tiktaktuk.ticket
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'VALID'
CHECK (status IN ('VALID', 'TERPAKAI', 'BATAL'));

-- ─── 2. Trigger: Cek Keterikatan Kursi sebelum Menghapus ────────────────────
-- Saat user menghapus kursi, cek apakah kursi sudah di-assign ke tiket.
-- Jika sudah, tolak penghapusan dengan pesan error.

CREATE OR REPLACE FUNCTION tiktaktuk.check_seat_assignment_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM tiktaktuk.has_relationship
        WHERE seat_id = OLD.seat_id
    ) THEN
        RAISE EXCEPTION 'ERROR: Kursi % - Baris % No. % tidak dapat dihapus karena sudah terisi.',
            OLD.section, OLD.row_number, OLD.seat_number;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_seat_before_delete ON tiktaktuk.seat;

CREATE TRIGGER trg_check_seat_before_delete
BEFORE DELETE ON tiktaktuk.seat
FOR EACH ROW
EXECUTE FUNCTION tiktaktuk.check_seat_assignment_before_delete();


-- ─── 3. Trigger: Cek Kuota Kategori Tiket sebelum Membuat Tiket ─────────────
-- Saat user membuat tiket baru, cek apakah jumlah tiket yang sudah ada
-- di kategori tersebut sudah mencapai batas quota.

CREATE OR REPLACE FUNCTION tiktaktuk.check_ticket_quota_before_insert()
RETURNS TRIGGER AS $$
DECLARE
    v_quota INT;
    v_current_count INT;
    v_category_name VARCHAR;
BEGIN
    -- Ambil quota dan nama kategori
    SELECT quota, category_name INTO v_quota, v_category_name
    FROM tiktaktuk.ticket_category
    WHERE category_id = NEW.tcategory_id;

    -- Hitung jumlah tiket yang sudah ada untuk kategori ini
    SELECT COUNT(*) INTO v_current_count
    FROM tiktaktuk.ticket
    WHERE tcategory_id = NEW.tcategory_id;

    -- Jika sudah penuh, tolak
    IF v_current_count >= v_quota THEN
        RAISE EXCEPTION 'ERROR: Kuota kategori tiket "%" sudah penuh. Tidak dapat membuat tiket baru.', v_category_name;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_ticket_quota ON tiktaktuk.ticket;

CREATE TRIGGER trg_check_ticket_quota
BEFORE INSERT ON tiktaktuk.ticket
FOR EACH ROW
EXECUTE FUNCTION tiktaktuk.check_ticket_quota_before_insert();
