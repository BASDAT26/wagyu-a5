SET search_path TO tiktaktuk;

-- 1. TRIGGER: Validasi Duplikasi artist_id dan event_id pada EVENT_ARTIST
--    saat Menambahkan Artist ke Event

DROP TRIGGER IF EXISTS trg_validate_event_artist ON tiktaktuk.event_artist;
DROP FUNCTION IF EXISTS tiktaktuk.fn_validate_event_artist();

CREATE OR REPLACE FUNCTION tiktaktuk.fn_validate_event_artist()
RETURNS TRIGGER AS $$
DECLARE
    v_artist_name VARCHAR(100);
    v_event_title VARCHAR(200);
BEGIN
  
    SELECT name INTO v_artist_name
    FROM tiktaktuk.artist
    WHERE artist_id = NEW.artist_id;

    IF v_artist_name IS NULL THEN
        RAISE EXCEPTION 'ERROR: Artist dengan ID % tidak ditemukan.', NEW.artist_id;
    END IF;

    SELECT event_title INTO v_event_title
    FROM tiktaktuk.event
    WHERE event_id = NEW.event_id;

    IF v_event_title IS NULL THEN
        RAISE EXCEPTION 'ERROR: Event dengan ID % tidak ditemukan.', NEW.event_id;
    END IF;

    IF EXISTS (
        SELECT 1 FROM tiktaktuk.event_artist
        WHERE event_id = NEW.event_id AND artist_id = NEW.artist_id
    ) THEN
        RAISE EXCEPTION 'ERROR: Artist "%" sudah terdaftar pada event "%".', v_artist_name, v_event_title;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trg_validate_event_artist
BEFORE INSERT ON tiktaktuk.event_artist
FOR EACH ROW
EXECUTE FUNCTION tiktaktuk.fn_validate_event_artist();



-- 2. STORED PROCEDURE: Menampilkan Sisa Kuota Ticket Category
--    Berdasarkan tevent_id

DROP FUNCTION IF EXISTS tiktaktuk.sp_get_ticket_category_quota(UUID);

CREATE OR REPLACE FUNCTION tiktaktuk.sp_get_ticket_category_quota(
    p_event_id UUID
)
RETURNS TABLE (
    category_id UUID,
    category_name VARCHAR(50),
    quota INTEGER,
    price NUMERIC(12,2),
    sold BIGINT,
    remaining BIGINT
) AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM tiktaktuk.event WHERE event_id = p_event_id
    ) THEN
        RAISE EXCEPTION 'ERROR: Event dengan ID % tidak ditemukan.', p_event_id;
    END IF;

    RETURN QUERY
    SELECT
        tc.category_id,
        tc.category_name,
        tc.quota,
        tc.price,
        COALESCE(COUNT(t.ticket_id), 0) AS sold,
        (tc.quota - COALESCE(COUNT(t.ticket_id), 0)) AS remaining
    FROM tiktaktuk.ticket_category tc
    LEFT JOIN tiktaktuk.ticket t ON tc.category_id = t.tcategory_id
    WHERE tc.tevent_id = p_event_id
    GROUP BY tc.category_id, tc.category_name, tc.quota, tc.price
    ORDER BY tc.category_name;
END;
$$ LANGUAGE plpgsql;