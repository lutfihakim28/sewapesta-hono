CREATE TRIGGER IF NOT EXISTS inventory_item_quantity
AFTER INSERT ON inventory_item_mutations
BEGIN
  UPDATE inventory_items
  SET total_quantity = MAX(0,
    CASE
      WHEN NEW.type = 'Adjustment' THEN NEW.quantity
      WHEN NEW.type = 'Addition'   THEN total_quantity + NEW.quantity
      WHEN NEW.type = 'Reduction'  THEN total_quantity - NEW.quantity
      ELSE total_quantity
    END
  )
  WHERE id = NEW.inventory_item_id;
END;