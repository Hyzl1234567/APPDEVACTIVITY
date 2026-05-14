// src/screens/HomeScreen.tsx

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { resetLogin } from '../app/actions';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import CustomButton from '../components/CustomButton';
import {
  FETCH_PRODUCTS,
  FETCH_CATEGORIES,
  Product,
  Category,
} from '../app/reducers/products';

const { width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavigationProps {
  navigate: (screen: string) => void;
}

interface CartItem extends Product {
  quantity: number;
}

interface RootState {
  auth: {
    data: {
      user?: {
        fullName?: string;
        displayName?: string;
        name?: string;
        email?: string;
      };
    } | null;
  };
  products: {
    products: Product[];
    categories: Category[];
    loading: boolean;
    error: string | null;
  };
}

// ─── Category Pill ────────────────────────────────────────────────────────────

const CategoryPill: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryPill, selected && styles.categoryPillActive]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <Text style={[styles.categoryLabel, selected && styles.categoryLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── Featured Card ────────────────────────────────────────────────────────────

const FeaturedCard: React.FC<{
  item: Product;
  onAdd: (item: Product) => void;
}> = ({ item, onAdd }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => onAdd(item));
  };

  return (
    <Animated.View style={[styles.featuredCard, { transform: [{ scale }] }]}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.featuredImage} resizeMode="cover" />
      ) : (
        <View style={styles.featuredImagePlaceholder}>
          <Text style={styles.placeholderEmoji}>🍃</Text>
        </View>
      )}
      <View style={styles.featuredCardBody}>
        <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.featuredDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.featuredFooter}>
          <Text style={styles.featuredPrice}>₱{item.price}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={handlePress} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// ─── Product Row ──────────────────────────────────────────────────────────────

const ProductRow: React.FC<{
  item: Product;
  cartQty: number;
  onAdd: (item: Product) => void;
  onRemove: (id: number) => void;
}> = ({ item, cartQty, onAdd, onRemove }) => (
  <View style={styles.productRow}>
    {item.image ? (
      <Image source={{ uri: item.image }} style={styles.productRowImage} resizeMode="cover" />
    ) : (
      <View style={styles.productRowImagePlaceholder}>
        <Text style={styles.placeholderEmoji}>🛒</Text>
      </View>
    )}
    <View style={styles.productRowInfo}>
      <Text style={styles.productRowName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.productRowDesc} numberOfLines={1}>{item.description}</Text>
      <View style={styles.productRowMeta}>
        <Text style={styles.productRowPrice}>₱{item.price}</Text>
        {item.size && <Text style={styles.productRowSize}>{item.size}</Text>}
      </View>
    </View>
    <View style={styles.qtyControl}>
      {cartQty > 0 && (
        <>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onRemove(item.id)}>
            <Text style={styles.qtyBtnMinus}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyCount}>{cartQty}</Text>
        </>
      )}
      <TouchableOpacity style={styles.qtyBtnAdd} onPress={() => onAdd(item)}>
        <Text style={styles.qtyBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const HomeScreen: React.FC = () => {
  // ── Original hooks (unchanged) ──
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ── Original analytics effect (unchanged) ──
  useEffect(() => {
    const logAnalytics = async () => {
      try {
        const analyticsInstance = getAnalytics();
        await logEvent(analyticsInstance, 'app_open');
        console.log('Analytics event logged!');
      } catch (error) {
        console.log('Analytics error:', error);
      }
    };
    logAnalytics();
  }, []);

  // ── Original logout handler (unchanged) ──
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await GoogleSignin.signOut();
      dispatch(resetLogin());
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ── Redux state ──
  const authState  = useSelector((state: RootState) => state.auth);
  const { products, categories, loading, error } = useSelector((state: RootState) => state.products);

  const userData = authState?.data?.user;
  const userName =
    userData?.fullName    ||
    userData?.displayName ||
    userData?.name        ||
    userData?.email?.split('@')[0] ||
    'Friend';
  const firstName = userName.split(' ')[0];

  // ── Fetch on mount ──
  useEffect(() => {
    dispatch({ type: FETCH_CATEGORIES });
    dispatch({ type: FETCH_PRODUCTS });
  }, []);

  // ── Local UI state ──
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartVisible, setCartVisible] = useState(false);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Filter products by selected category
  const filteredProducts = selectedCategoryId
    ? products.filter(p => p.category?.id === selectedCategoryId)
    : products;

  // First 5 products as featured
  const featured = products.slice(0, 5);

  const getCartQty = (id: number) => cart.find(i => i.id === id)?.quantity ?? 0;

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const handleCategoryPress = (id: number | null) => {
    setSelectedCategoryId(id);
    if (id !== null) {
      dispatch({ type: FETCH_PRODUCTS, payload: { categoryId: id } });
    } else {
      dispatch({ type: FETCH_PRODUCTS });
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF5E6" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{firstName} 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => setCartVisible(!cartVisible)}
          activeOpacity={0.85}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Promo Banner ── */}
        <View style={styles.banner}>
          <View style={styles.bannerTextBlock}>
            <Text style={styles.bannerSmall}>Today's Offer</Text>
            <Text style={styles.bannerTitle}>Sip Sustainably,{'\n'}Eat Naturally 🌿</Text>
            <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.85}>
              <Text style={styles.bannerBtnText}>Order Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerArt}>
            <Text style={styles.bannerEmoji}>☕</Text>
            <Text style={styles.bannerEmojiSmall1}>🍃</Text>
            <Text style={styles.bannerEmojiSmall2}>🌱</Text>
          </View>
        </View>

        {/* ── Loading / Error ── */}
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={GREEN_DARK} />
            <Text style={styles.loadingText}>Loading menu...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                dispatch({ type: FETCH_CATEGORIES });
                dispatch({ type: FETCH_PRODUCTS });
              }}
            >
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && (
          <>
            {/* ── Featured ── */}
            {featured.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>⭐ Featured</Text>
                </View>
                <FlatList
                  data={featured}
                  keyExtractor={i => String(i.id)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredList}
                  renderItem={({ item }) => (
                    <FeaturedCard item={item} onAdd={addToCart} />
                  )}
                  scrollEnabled
                />
              </>
            )}

            {/* ── Categories ── */}
            {categories.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                  <Text style={styles.sectionTitle}>🗂 Menu</Text>
                </View>
                <FlatList
                  data={[{ id: null, name: 'All', description: '' }, ...categories]}
                  keyExtractor={i => String(i.id ?? 'all')}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryList}
                  renderItem={({ item }) => (
                    <CategoryPill
                      label={item.name}
                      selected={selectedCategoryId === item.id}
                      onPress={() => handleCategoryPress(item.id)}
                    />
                  )}
                />
              </>
            )}

            {/* ── Product List ── */}
            <View style={styles.productList}>
              {filteredProducts.length === 0 ? (
                <View style={styles.centered}>
                  <Text style={styles.emptyText}>No products found</Text>
                </View>
              ) : (
                filteredProducts.map(item => (
                  <ProductRow
                    key={item.id}
                    item={item}
                    cartQty={getCartQty(item.id)}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                  />
                ))
              )}
            </View>
          </>
        )}

        {/* ── Logout ── */}
        <View style={styles.logoutSection}>
          <CustomButton
            label="LOGOUT"
            backgroundColor="green"
            onPress={handleLogout}
            loading={isLoggingOut}
            disabled={isLoggingOut}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Cart Bar ── */}
      {cartCount > 0 && (
        <View style={styles.cartBar}>
          <View style={styles.cartBarLeft}>
            <Text style={styles.cartBarCount}>{cartCount} item{cartCount > 1 ? 's' : ''}</Text>
            <Text style={styles.cartBarTotal}>₱{cartTotal}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85}>
            <Text style={styles.checkoutBtnText}>View Order →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Cart Drawer ── */}
      {cartVisible && cart.length > 0 && (
        <View style={styles.cartDrawer}>
          <View style={styles.cartDrawerHeader}>
            <Text style={styles.cartDrawerTitle}>Your Order</Text>
            <TouchableOpacity onPress={() => setCartVisible(false)}>
              <Text style={styles.cartDrawerClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 260 }} nestedScrollEnabled>
            {cart.map(item => (
              <View key={item.id} style={styles.cartItem}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                ) : (
                  <Text style={styles.cartItemEmoji}>🛒</Text>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>₱{item.price} × {item.quantity}</Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)}>
                    <Text style={styles.qtyBtnMinus}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyCount}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtnAdd} onPress={() => addToCart(item)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.cartDrawerFooter}>
            <Text style={styles.cartDrawerTotal}>Total: ₱{cartTotal}</Text>
            <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85}>
              <Text style={styles.checkoutBtnText}>Checkout →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const GREEN_DARK  = '#1D4A23';
const GREEN_MID   = '#2E7D32';
const GREEN_LIGHT = '#99CC67';
const GREEN_BG    = '#EEF5E6';
const CREAM       = '#FFFDF5';
const TEXT_MAIN   = '#1A2E1B';
const TEXT_MUTED  = '#6B7C6D';

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: GREEN_BG },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: GREEN_BG,
  },
  greeting:  { fontSize: 13, color: TEXT_MUTED, fontWeight: '500' },
  userName:  { fontSize: 22, fontWeight: '800', color: GREEN_DARK, marginTop: 2 },
  cartBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: GREEN_DARK,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 5,
  },
  cartIcon:      { fontSize: 22 },
  cartBadge: {
    position: 'absolute', top: -2, right: -2, backgroundColor: '#FF5722',
    borderRadius: 10, minWidth: 20, height: 20,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
  },
  cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  // Banner
  banner: {
    marginHorizontal: 20, marginBottom: 24, borderRadius: 20,
    backgroundColor: GREEN_DARK, padding: 22,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
  },
  bannerTextBlock:   { flex: 1 },
  bannerSmall:       { fontSize: 12, color: GREEN_LIGHT, fontWeight: '600', letterSpacing: 1, marginBottom: 6 },
  bannerTitle:       { fontSize: 18, fontWeight: '800', color: '#FFF', lineHeight: 26, marginBottom: 16 },
  bannerBtn:         { alignSelf: 'flex-start', backgroundColor: GREEN_LIGHT, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20 },
  bannerBtnText:     { color: GREEN_DARK, fontWeight: '800', fontSize: 13 },
  bannerArt:         { width: 80, alignItems: 'center', position: 'relative' },
  bannerEmoji:       { fontSize: 52 },
  bannerEmojiSmall1: { fontSize: 20, position: 'absolute', top: -4,  right: -4 },
  bannerEmojiSmall2: { fontSize: 16, position: 'absolute', bottom: 0, left: 0  },

  // Loading / Error
  centered:     { alignItems: 'center', paddingVertical: 32 },
  loadingText:  { marginTop: 10, fontSize: 14, color: TEXT_MUTED },
  emptyText:    { fontSize: 14, color: TEXT_MUTED },
  errorBox: {
    marginHorizontal: 20, padding: 16, borderRadius: 12,
    backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#FFB74D',
    alignItems: 'center', marginBottom: 16,
  },
  errorText:    { fontSize: 14, color: '#E65100', marginBottom: 10, textAlign: 'center' },
  retryBtn:     { backgroundColor: GREEN_DARK, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  retryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },

  // Section
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: TEXT_MAIN },

  // Featured
  featuredList: { paddingHorizontal: 20, gap: 14 },
  featuredCard: {
    width: 180, backgroundColor: CREAM, borderRadius: 18, overflow: 'hidden', marginBottom: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  featuredImage:          { width: '100%', height: 110 },
  featuredImagePlaceholder: {
    width: '100%', height: 110, backgroundColor: GREEN_BG,
    justifyContent: 'center', alignItems: 'center',
  },
  featuredCardBody:  { padding: 12 },
  featuredName:      { fontSize: 14, fontWeight: '800', color: TEXT_MAIN, marginBottom: 4 },
  featuredDesc:      { fontSize: 11, color: TEXT_MUTED, lineHeight: 16, marginBottom: 10 },
  featuredFooter:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredPrice:     { fontSize: 16, fontWeight: '800', color: GREEN_DARK },
  addBtn:            { width: 30, height: 30, borderRadius: 15, backgroundColor: GREEN_DARK, justifyContent: 'center', alignItems: 'center' },
  addBtnText:        { color: '#FFF', fontSize: 20, fontWeight: '300', lineHeight: 24 },
  placeholderEmoji:  { fontSize: 32 },

  // Categories
  categoryList: { paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  categoryPill: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
    backgroundColor: CREAM, borderWidth: 1.5, borderColor: '#DDE8D0',
  },
  categoryPillActive:  { backgroundColor: GREEN_DARK, borderColor: GREEN_DARK },
  categoryLabel:       { fontSize: 13, fontWeight: '600', color: TEXT_MUTED },
  categoryLabelActive: { color: '#FFF' },

  // Product rows
  productList:   { paddingHorizontal: 20, gap: 12 },
  productRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: CREAM,
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  productRowImage: { width: 80, height: 80 },
  productRowImagePlaceholder: {
    width: 80, height: 80, backgroundColor: GREEN_BG,
    justifyContent: 'center', alignItems: 'center',
  },
  productRowInfo:  { flex: 1, padding: 10 },
  productRowName:  { fontSize: 14, fontWeight: '700', color: TEXT_MAIN, marginBottom: 2 },
  productRowDesc:  { fontSize: 11, color: TEXT_MUTED, marginBottom: 4 },
  productRowMeta:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  productRowPrice: { fontSize: 14, fontWeight: '800', color: GREEN_DARK },
  productRowSize:  { fontSize: 11, color: TEXT_MUTED, backgroundColor: GREEN_BG, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },

  // Qty
  qtyControl:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 10 },
  qtyBtn:      { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  qtyBtnAdd:   { width: 28, height: 28, borderRadius: 14, backgroundColor: GREEN_DARK, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText:  { fontSize: 18, fontWeight: '400', color: '#FFF', lineHeight: 22 },
  qtyBtnMinus: { fontSize: 18, fontWeight: '400', color: TEXT_MAIN, lineHeight: 22 },
  qtyCount:    { fontSize: 14, fontWeight: '700', color: TEXT_MAIN, minWidth: 16, textAlign: 'center' },

  // Logout
  logoutSection: { paddingHorizontal: 20, marginTop: 32 },

  // Cart bar
  cartBar: {
    position: 'absolute', bottom: 20, left: 20, right: 20,
    backgroundColor: GREEN_DARK, borderRadius: 20, padding: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 10,
  },
  cartBarLeft:     { gap: 2 },
  cartBarCount:    { fontSize: 12, color: GREEN_LIGHT, fontWeight: '600' },
  cartBarTotal:    { fontSize: 18, fontWeight: '800', color: '#FFF' },
  checkoutBtn:     { backgroundColor: GREEN_LIGHT, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14 },
  checkoutBtnText: { color: GREEN_DARK, fontWeight: '800', fontSize: 14 },

  // Cart drawer
  cartDrawer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: CREAM, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 20,
  },
  cartDrawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cartDrawerTitle:  { fontSize: 18, fontWeight: '800', color: TEXT_MAIN },
  cartDrawerClose:  { fontSize: 18, color: TEXT_MUTED, fontWeight: '600' },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE',
  },
  cartItemImage:    { width: 44, height: 44, borderRadius: 10 },
  cartItemEmoji:    { fontSize: 28 },
  cartItemName:     { fontSize: 14, fontWeight: '700', color: TEXT_MAIN },
  cartItemPrice:    { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },
  cartDrawerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  cartDrawerTotal:  { fontSize: 18, fontWeight: '800', color: GREEN_DARK },
});

export default HomeScreen;
